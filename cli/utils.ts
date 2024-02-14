import fs from 'fs';
import path from 'path';
import { decodeAbiParameters } from 'viem';

export const getSolidityType = (type: string) => {
    switch (type) {
        case "CircuitValue":
            return "uint256";
        case "CircuitValue256":
            return "uint256";
        case "CircuitValue[]":
            return "uint256[]";
        case "CircuitValue256[]":
            return "uint256[]";
        default:
            throw new Error(`Unknown type ${type}`);
    }
}

export const findFilesWithAxiomInput = (directory: string): string | null => {
    let file: string | null = null;

    function traverseDirectory(dir: string): void {
        const entries = fs.readdirSync(dir);

        for (const entry of entries) {
            const entryPath = path.join(dir, entry);
            const stat = fs.statSync(entryPath);

            if (stat.isDirectory()) {
                traverseDirectory(entryPath);
            } else if (stat.isFile() && entry.endsWith('.json')) {
                const fileContent = fs.readFileSync(entryPath, 'utf8');
                if (fileContent.includes('.AxiomInput"')) {
                    file = entryPath;
                    return;
                }
            }
        }
    }

    traverseDirectory(directory);

    return file;
}

export const findStructDefinition = (jsonFile: string): any | null => {
    const jsonData = require(jsonFile);
    const fileName = path.basename(jsonFile, path.extname(jsonFile));

    function traverseObject(obj: any): any | null {
        if (obj.nodeType === "StructDefinition" && obj.canonicalName === `${fileName}.AxiomInput`) {
            return obj;
        }

        for (const key in obj) {
            if (typeof obj[key] === "object") {
                const result = traverseObject(obj[key]);
                if (result !== null) {
                    return result;
                }
            }
        }

        return null;
    }

    return traverseObject(jsonData);
}

export const getAbi = (): { name: string; type: string; }[] => {
    const jsonFile = findFilesWithAxiomInput(process.cwd());

    if (jsonFile === null) {
        throw new Error("Could not find json file with AxiomInput");
    }

    const structDefinition = findStructDefinition(jsonFile);

    if (structDefinition === null) {
        throw new Error(`Could not find struct definition in file ${jsonFile}`);
    }

    const abi: { name: string; type: string; }[] = [];

    for (const member of structDefinition.members) {
        const type = member.typeDescriptions.typeString;
        if (type === undefined) {
            throw new Error(`Could not find type for member ${member.name}`);
        }
        abi.push({ name: member.name, type });
    }

    return abi;

}

export const getInputs = (inputs: string, inputSchema: string): any => {
    const inputSchemaJson = JSON.parse(inputSchema);
    const keys = Object.keys(inputSchemaJson);
    const abi = getAbi();

    const rawInputs: any[] = decodeAbiParameters(abi, inputs as `0x${string}`);

    const circuitInputs: any = {};
    for (let i = 0; i < keys.length; i++) {
        // if (keys[i] !== abi[i].name) throw new Error(`Input key ${keys[i]} does not match ABI name ${abi[i].name}`);
        if (Array.isArray(rawInputs[i])) {
            circuitInputs[keys[i]] = rawInputs[i].map((x: any) => x.toString());
        } else {
            circuitInputs[keys[i]] = rawInputs[i].toString();
        }
    }
    return circuitInputs;
}