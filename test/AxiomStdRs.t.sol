// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import { FulfillCallbackArgs, QueryArgs } from "../src/AxiomVm.sol";
import { AxiomTest } from "../src/AxiomTest.sol";

import { IAxiomV2Query } from "@axiom-crypto/v2-periphery/interfaces/query/IAxiomV2Query.sol";

import { AccountAge } from "./example/AccountAge.sol";

contract AxiomStdRsTest is AxiomTest {
    struct Input {
        uint256 blockNumber;
        uint256 _address;
    }

    AccountAge public accountAge;
    Input public defaultInput;
    bytes32 public querySchema;

    bytes public callbackExtraData;
    IAxiomV2Query.AxiomV2FeeData public feeData;

    function setUp() public {
        _createSelectForkAndSetupAxiom("sepolia", 5_103_100);

        defaultInput =
            Input({ blockNumber: 5_146_659, _address: uint256(uint160(0xef663bB0e0b1091571DaD9715994bc81e9f5a2ab)) });
        querySchema = axiomVm.readRustCircuit({
            _manifestPath: "test/circuit-rs/Cargo.toml",
            _rustCircuitPath: "test/circuit-rs/data/account_age_input.json",
            _dataPath: "test/circuit-rs/data",
            _bin: "circuit-rs"
        });
        accountAge = new AccountAge(axiomV2QueryAddress, uint64(block.chainid), querySchema);

        callbackExtraData = bytes("");
        feeData = IAxiomV2Query.AxiomV2FeeData({
            maxFeePerGas: 25 gwei,
            callbackGasLimit: 1_000_000,
            overrideAxiomQueryFee: 0
        });
    }

    function test_rs_sendQuery() public {
        axiomVm.getArgsAndSendQuery(querySchema, abi.encode(defaultInput), address(accountAge));
    }

    function test_rs_sendQueryWithArgs() public {
        (QueryArgs memory args,) = axiomVm.sendQueryArgs(
            querySchema, abi.encode(defaultInput), address(accountAge), callbackExtraData, feeData
        );
        axiomV2Query.sendQuery{ value: args.value }(
            args.sourceChainId,
            args.dataQueryHash,
            args.computeQuery,
            args.callback,
            args.feeData,
            args.userSalt,
            args.refundee,
            args.dataQuery
        );
    }

    function test_rs_callback() public {
        axiomVm.prankCallback(
            querySchema, abi.encode(defaultInput), address(accountAge), callbackExtraData, feeData, msg.sender
        );
    }

    function test_rs_callbackWithArgs() public {
        FulfillCallbackArgs memory args = axiomVm.fulfillCallbackArgs(
            querySchema, abi.encode(defaultInput), address(accountAge), callbackExtraData, feeData, msg.sender
        );
        axiomVm.prankCallback(args);
    }
}
