import { Command } from "commander";
import { compile } from "./compile";
import { prove } from "./prove";

const program = new Command("axiom-std");

program.name("axiom-std").usage("axiom-std CLI");

program.command("read-circuit")
    .description("Read and compile a circuit")
    .argument("<circuit-path>", "path to the typescript circuit file")
    .argument("<rpc-url>", "JSON-RPC provider to use")
    .option("-q, --override-query-schema <suffix>", "query schema")
    .action(compile);

program.command("prove")
    .description("Prove a circuit and generate query results")
    .argument("<compiled-json>", "compiled json string")
    .argument("<inputs>", "inputs to the circuit")
    .argument("<rpc-url>", "JSON-RPC provider to use for the source chain")
    .argument("<source-chain-id>", "source chain id")
    .argument("<callback-target>", "callback target")
    .argument("<callback-extra-data>", "callback extra data")
    .argument("<refund-address>", "refund address")
    .argument("<max-fee-per-gas>", "max fee per gas")
    .argument("<callback-gas-limit>", "callback gas limit")
    .argument("<caller>", "caller")
    .action(prove);

program.parseAsync(process.argv);