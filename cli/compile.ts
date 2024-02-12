import { AxiomBaseCircuit } from "@axiom-crypto/circuit/js";
import { getFunctionFromTs, getProvider, readInputs, saveJsonToFile } from "@axiom-crypto/circuit/cliHandler/utils";
import { decodeAbiParameters, encodeAbiParameters } from 'viem';
import { getAbi, getInputs, getSolidityType } from "./utils";

export const compile = async (
    circuitPath: string,
    providerUri: string,
) => {
    let circuitFunction = "circuit";
    const f = await getFunctionFromTs(circuitPath, circuitFunction);
    const provider = getProvider(providerUri);
    const circuit = new AxiomBaseCircuit({
        f: f.circuit,
        mock: true,
        provider,
        shouldTime: false,
        inputSchema: f.inputSchema,
    })

    try {
        const res = await circuit.mockCompile(f.defaultInputs);
        const circuitFn = `const ${f.importName} = AXIOM_CLIENT_IMPORT\n${f.circuit.toString()}`;
        const encoder = new TextEncoder();
        const circuitBuild = encoder.encode(circuitFn);
        const build = {
            ...res,
            circuit: Buffer.from(circuitBuild).toString('base64'),
        }
        console.log(JSON.stringify(build));
    }
    catch (e) {
        console.error(e);
    }
}