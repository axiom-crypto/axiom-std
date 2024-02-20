import { AxiomBaseCircuit } from "@axiom-crypto/circuit/js";
import { getFunctionFromTs, getProvider } from "@axiom-crypto/circuit/cliHandler/utils";

export const compile = async (
    circuitPath: string,
    providerUri: string,
    options: {overrideQuerySchema?: string }
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
        if (options.overrideQuerySchema) {
            res.querySchema = ("0xdeadbeef" + options.overrideQuerySchema).padEnd(66, '0').substring(0, 66);
        } 
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