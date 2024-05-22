import { Command } from "commander";
import { compile } from "./compile";
import { prove } from "./prove";

const program = new Command("axiom-std");

program.name("axiom-std").usage("axiom-std CLI");

program.command("readCircuit")
    .description("Read and compile a circuit")
    .argument("<circuitPath>", "path to the typescript circuit file")
    .argument("<rpcUrl>", "JSON-RPC provider to use")
    .option("-q, --override-query-schema <suffix>", "query schema")
    .action(compile);

program.command("prove")
    .description("Prove a circuit and generate query results")
    .argument("<compiledJson>", "compiled json string")
    .argument("<inputs>", "inputs to the circuit")
    .argument("<rpcUrl>", "JSON-RPC provider to use for the source chain")
    .argument("<sourceChainId>", "source chain id")
    .argument("<callbackTarget>", "callback target")
    .argument("<callbackExtraData>", "callback extra data")
    .argument("<refundAddress>", "refund address")
    .argument("<maxFeePerGas>", "max fee per gas")
    .argument("<callbackGasLimit>", "callback gas limit")
    .argument("<caller>", "caller")
    .option("-t, --targetChainId [targetChainId]", "target chain id")
    .option("-b, --bridgeId [bridgeId]", "bridge id", parseInt)
    .option("-br, --broadcaster", "Use crosschain broadcaster")
    .option("-bo, --blockhashOracle", "Use crosschain blockhash oracle")
    .option("-tr, --targetRpcUrl [targetRpcUrl]", "JSON-RPC provider to use for the target chain")    
    .action(prove);

program.parseAsync(process.argv);