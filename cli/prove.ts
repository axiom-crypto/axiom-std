import { AxiomBaseCircuit } from "@axiom-crypto/circuit/js";
import { getRpcUrl } from "@axiom-crypto/circuit/cliHandler/utils";
import { getInputs, redirectConsole } from './utils';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { buildSendQuery } from "@axiom-crypto/client";
import { argsArrToObj } from '@axiom-crypto/client/axiom/utils';
import { 
    getAxiomV2QueryAddress,
} from '@axiom-crypto/client/lib/address';

export const prove = async (
    compiledJson: string,
    inputs: string,
    rpcUrl: string,
    sourceChainId: string,
    callbackTarget: string,
    callbackExtraData: string,
    refundAddress: string,
    maxFeePerGas: string,
    callbackGasLimit: string,
    caller: string,
) => {
    const { restoreConsole, getCaptures } = redirectConsole();
    const decoder = new TextDecoder();

    const rpcUrlOrCache = getRpcUrl(rpcUrl);
    let compiled = JSON.parse(compiledJson);

    const decodedArray = Buffer.from(compiled.circuit, 'base64');
    const raw = decoder.decode(decodedArray);
    const AXIOM_CLIENT_IMPORT = require("@axiom-crypto/client");

    const circuit = new AxiomBaseCircuit({
        f: eval(raw),
        mock: true,
        rpcUrl: rpcUrlOrCache,
        shouldTime: false,
        inputSchema: compiled.inputSchema,
    })

    let decodedInputSchema = Buffer.from(compiled.inputSchema, 'base64');
    const circuitInputs = getInputs(inputs, decoder.decode(decodedInputSchema));

    try {
        let computeQuery;

        circuit.loadSavedMock(compiled);
        computeQuery = await circuit.mockProve(circuitInputs);

        const computeResults = circuit.getComputeResults();
        const dataQuery = circuit.getDataQuery();
        const res = {
            sourceChainId: circuit.getChainId(),
            computeQuery,
            computeResults,
            dataQuery,
        }

        let axiomV2QueryAddress;
        if (sourceChainId in ["1", "11155111"]) {
            axiomV2QueryAddress = getAxiomV2QueryAddress(sourceChainId);
        } else {
            axiomV2QueryAddress = "0xdEaDBEefDeaDbEefDeAdbeefDeAdbEEfAAaaAAaA";
        }

        let build = await buildSendQuery({
            chainId: sourceChainId,
            rpcUrl: rpcUrlOrCache,
            axiomV2QueryAddress,   
            dataQuery: res.dataQuery,
            computeQuery: res.computeQuery,
            callback: {
                target: callbackTarget,
                extraData: callbackExtraData,
            },
            caller: caller,
            mock: false,
            options: {
                refundee: refundAddress,
                maxFeePerGas: maxFeePerGas,
                callbackGasLimit: Number(callbackGasLimit),
            },
        });
        build.value = build.value.toString() as any;
        const query = {
            value: build.value,
            mock: build.mock,
            queryId: build.queryId,
            args: argsArrToObj(build.args),
            calldata: build.calldata,
            computeResults,
        };

        const logs = getCaptures();
        const output = encodeAbiParameters(parseAbiParameters('string x, string y, string z'), [logs.logs, logs.errors, JSON.stringify(query)])
        restoreConsole();
        console.log(output);
    }
    catch (e) {
        console.error(e);
        const logs = getCaptures();
        const output = encodeAbiParameters(parseAbiParameters('string x, string y, string z'), [logs.logs, logs.errors, ""])
        restoreConsole();
        console.log(output);
    }
}