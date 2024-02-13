// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";

// 🧩 MODULES
import {AxiomVm, Query, Axiom, QueryArgs, FulfillCallbackArgs} from "./AxiomVm.sol";
import { IAxiomV2Core } from "@axiom-crypto/v2-periphery/interfaces/core/IAxiomV2Core.sol";
import { IAxiomV2Query } from "@axiom-crypto/v2-periphery/interfaces/query/IAxiomV2Query.sol";
import { IAxiomV2Client } from "@axiom-crypto/v2-periphery/interfaces/client/IAxiomV2Client.sol";
import { AxiomV2Addresses } from "./AxiomV2Addresses.sol";

// ⭐️ TEST
/// @title AxiomTest
/// @dev An extension to the Foundry test contract that sets up an Axiom environment and provides
///      cheatcodes for testing Axiom client contracts
abstract contract AxiomTest is Test {
    /// @dev The address of the AxiomV2Core contract
    address public axiomV2CoreAddress;

    /// @dev The address of the AxiomV2Query contract
    address public axiomV2QueryAddress;

    /// @dev The AxiomV2Core contract
    IAxiomV2Core public axiomV2Core;

    /// @dev The AxiomV2Query contract
    IAxiomV2Query public axiomV2Query;

    /// @dev The AxiomVm contract
    AxiomVm axiomVm;

    /// @dev Event emitted when a query is initiated on-chain
    event QueryInitiatedOnchain(
        address indexed caller,
        bytes32 indexed queryHash,
        uint256 indexed queryId,
        bytes32 userSalt,
        address refundee,
        address target,
        bytes extraData
    );

    /// @dev Event emitted when a query is initiated on-chain
    event QueryFeeInfoRecorded(
        uint256 indexed queryId,
        address indexed payor,
        uint32 deadlineBlockNumber,
        uint64 maxFeePerGas,
        uint32 callbackGasLimit,
        uint256 amount
    );

    /// @dev Create a forked test environment and set up Axiom contracts
    /// @param urlOrAlias The URL or alias of the fork to create
    /// @param forkBlock The block number to fork from
    function _createSelectForkAndSetupAxiom(string memory urlOrAlias, uint256 forkBlock) internal {
        vm.createSelectFork(urlOrAlias, forkBlock);
        uint64 chainId = uint64(block.chainid);

        if (chainId == 1) {
            axiomV2CoreAddress = AxiomV2Addresses.axiomV2CoreAddress(chainId);
            axiomV2QueryAddress = AxiomV2Addresses.axiomV2QueryAddress(chainId);

            require(
                forkBlock >= AxiomV2Addresses.axiomV2CoreDeployBlock(chainId),
                "AxiomV2Core not yet deployed at forkBlock"
            );
            require(
                forkBlock >= AxiomV2Addresses.axiomV2QueryDeployBlock(chainId),
                "AxiomV2Query not yet deployed at forkBlock"
            );
        } else {
            axiomV2CoreAddress = AxiomV2Addresses.axiomV2CoreMockAddress(chainId);
            axiomV2QueryAddress = AxiomV2Addresses.axiomV2QueryMockAddress(chainId);

            require(
                forkBlock >= AxiomV2Addresses.axiomV2CoreMockDeployBlock(chainId),
                "AxiomV2CoreMock not yet deployed at forkBlock"
            );
            require(
                forkBlock >= AxiomV2Addresses.axiomV2QueryMockDeployBlock(chainId),
                "AxiomV2QueryMock not yet deployed at forkBlock"
            );
        }
        axiomV2Core = IAxiomV2Core(axiomV2CoreAddress);
        axiomV2Query = IAxiomV2Query(axiomV2QueryAddress);

        vm.makePersistent(axiomV2CoreAddress);
        vm.makePersistent(axiomV2QueryAddress);

        axiomVm = new AxiomVm(axiomV2QueryAddress, urlOrAlias);
    }

    /// @dev Create a query into Axiom with default parameters
    /// @param _querySchema The query schema to use
    /// @param input The input data for the query
    /// @param callbackTarget The address of the contract to send a callback to
    function query(bytes32 _querySchema, bytes memory input, address callbackTarget)
        internal
        view
        returns (Query memory)
    {
        return query(
            _querySchema,
            input,
            callbackTarget,
            bytes(""),
            IAxiomV2Query.AxiomV2FeeData({ maxFeePerGas: 25 gwei, callbackGasLimit: 1_000_000, overrideAxiomQueryFee: 0 })
        );
    }

    /// @dev Create a query into Axiom with advanced parameters
    /// @param _querySchema The query schema to use
    /// @param input The input data for the query
    /// @param callbackTarget The address of the contract to send a callback to
    /// @param callbackExtraData Extra data to include in the callback
    /// @param feeData The fee data for the query
    function query(
        bytes32 _querySchema,
        bytes memory input,
        address callbackTarget,
        bytes memory callbackExtraData,
        IAxiomV2Query.AxiomV2FeeData memory feeData
    ) internal view returns (Query memory) {
        return Query({
            querySchema: _querySchema,
            input: input,
            callbackTarget: callbackTarget,
            callbackExtraData: callbackExtraData,
            feeData: feeData,
            axiomVm: axiomVm,
            outputString: ""
        });
    }
}
