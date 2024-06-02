import { Command } from "commander";
import { compile } from "./compile";
import { prove } from "./prove";
import { mockQueryArgs } from "./sdkRs/mockQueryArgs";

const program = new Command("axiom-std");

program.name("axiom-std").usage("axiom-std CLI");

program.command("readCircuit")
    .description("Read and compile a circuit")
    .argument("<circuitPath>", "path to the typescript circuit file")
    .argument("<providerUri>", "provider to use")
    .option("-q, --override-query-schema <suffix>", "query schema")
    .action(compile);

program.command("prove")
    .description("Prove a circuit")
    .argument("<compiledJson>", "compiled json string")
    .argument("<inputs>", "inputs to the circuit")
    .argument("<providerUri>", "provider to use")
    .argument("<sourceChainId>", "source chain id")
    .argument("<callbackTarget>", "callback target")
    .argument("<callbackExtraData>", "callback extra data")
    .argument("<refundAddress>", "refund address")
    .argument("<maxFeePerGas>", "max fee per gas")
    .argument("<callbackGasLimit>", "callback gas limit")
    .argument("<caller>", "caller")
    .action(prove);


const sdkRs = program.command("sdk-rs")
    .description("Axiom Rust SDK helper commands");

sdkRs.command("mock-query-args")
    .description("Generate a mock compute proof")
    .argument("<compute results string>", "compute results as a string")
    .argument("<query schema>", "query schema")
    .argument("<source chain id>", "source chain id")
    .argument("<callback target>", "callback target")
    .argument("<callback extra data>", "callback extra data")
    .argument("<max fee per gas>", "max fee per gas")
    .argument("<callback gas limit>", "callback gas limit")
    .argument("<override axiom query fee>", "override axiom query fee")
    .argument("<refundee>", "refundee")
    .action(mockQueryArgs);

program.parseAsync(process.argv);