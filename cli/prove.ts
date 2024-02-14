import path from 'path';
import { AxiomBaseCircuit } from "@axiom-crypto/circuit/js";
import { getFunctionFromTs, getProvider, readInputs, saveJsonToFile } from "@axiom-crypto/circuit/cliHandler/utils";
import { getInputs } from './utils';
import { decodeAbiParameters } from 'viem';
import { AxiomSdkCore } from "@axiom-crypto/core";
import { buildSendQuery } from "@axiom-crypto/client";
import { argsArrToObj } from '@axiom-crypto/client/axiom/utils';

export const prove = async (
    compiledJson: string,
    inputs: string,
    providerUri: string,
    sourceChainId: string,
    callbackTarget: string,
    callbackExtraData: string,
    refundAddress: string,
    maxFeePerGas: string,
    callbackGasLimit: string,
    caller: string,
) => {

    const decoder = new TextDecoder();

    const provider = getProvider(providerUri);
    let compiled = JSON.parse(compiledJson);

    const decodedArray = Buffer.from(compiled.circuit, 'base64');
    const raw = decoder.decode(decodedArray);
    const AXIOM_CLIENT_IMPORT = require("@axiom-crypto/client");

    const circuit = new AxiomBaseCircuit({
        f: eval(raw),
        mock: true,
        provider,
        shouldTime: false,
        inputSchema: compiled.inputSchema,
    })

    let decodedInputSchema = Buffer.from(compiled.inputSchema, 'base64');
    const circuitInputs = getInputs(inputs, decoder.decode(decodedInputSchema));

    const axiom = new AxiomSdkCore({
        providerUri: provider,
        chainId: sourceChainId,
        version: "v2",
    });

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

        let build = await buildSendQuery({
            axiom,
            dataQuery: res.dataQuery,
            computeQuery: res.computeQuery,
            callback: {
                target: callbackTarget,
                extraData: callbackExtraData,
            },
            options: {
                refundee: refundAddress,
                maxFeePerGas: maxFeePerGas,
                callbackGasLimit: Number(callbackGasLimit),
            },
            caller: caller,
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

        console.log(JSON.stringify(query));
    }
    catch (e) {
        console.error(e);
    }
}