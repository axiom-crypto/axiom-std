// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {
    MAINNET_CHAIN_ID,
    SEPOLIA_CHAIN_ID
} from "@axiom-crypto/v2-periphery/libraries/configuration/AxiomV2Configuration.sol";

uint64 constant BASE_SEPOLIA_CHAIN_ID = 84_532;
uint64 constant BASE_CHAIN_ID = 8453;

/// @title AxiomV2Addresses
/// @notice AxiomV2Addresses is a library that contains the addresses of deployed Axiom V2 contracts
library AxiomV2Addresses {
    address public constant AXIOM_V2_CORE_ADDRESS = 0x69963768F8407dE501029680dE46945F838Fc98B;
    address public constant AXIOM_V2_QUERY_ADDRESS = 0x83c8c0B395850bA55c830451Cfaca4F2A667a983;

    address public constant SEPOLIA_AXIOM_V2_CORE_MOCK_ADDRESS = 0x69963768F8407dE501029680dE46945F838Fc98B;
    address public constant SEPOLIA_AXIOM_V2_QUERY_MOCK_ADDRESS = 0x83c8c0B395850bA55c830451Cfaca4F2A667a983;

    address public constant BASE_AXIOM_V2_CORE_ADDRESS = 0xB93087Acb2b4dfF8854C01DC661710D6f5FB7a94;
    address public constant BASE_AXIOM_V2_QUERY_ADDRESS = 0xfe059442B0379D5f22Bec384A588766f98A36812;

    address public constant BASE_SEPOLIA_AXIOM_V2_CORE_MOCK_ADDRESS = 0xB93087Acb2b4dfF8854C01DC661710D6f5FB7a94;
    address public constant BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_ADDRESS = 0xfe059442B0379D5f22Bec384A588766f98A36812;

    address public constant BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_CROSSCHAIN_ADDRESS =
        0xFa44Fc4CDE68177Bd8212774a09E32d23fA1F41f;

    uint256 public constant AXIOM_V2_CORE_DEPLOY_BLOCK = 18_993_287;
    uint256 public constant AXIOM_V2_QUERY_DEPLOY_BLOCK = 19_027_522;

    uint256 public constant SEPOLIA_AXIOM_V2_CORE_MOCK_DEPLOY_BLOCK = 5_095_060;
    uint256 public constant SEPOLIA_AXIOM_V2_QUERY_MOCK_DEPLOY_BLOCK = 5_103_063;

    uint256 public constant BASE_AXIOM_V2_CORE_DEPLOY_BLOCK = 13_033_471;
    uint256 public constant BASE_AXIOM_V2_QUERY_DEPLOY_BLOCK = 13_465_169;

    uint256 public constant BASE_SEPOLIA_AXIOM_V2_CORE_MOCK_DEPLOY_BLOCK = 7_993_784;
    uint256 public constant BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_DEPLOY_BLOCK = 7_994_008;

    uint256 public constant BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_CROSSCHAIN_DEPLOY_BLOCK = 12_094_089;

    /// @dev Error returned if the corresponding Axiom V2 contract does not exist for the requested chainId
    error ContractDoesNotExistForChainId();

    /// @dev Error returned if the corresponding Axiom V2 contract has not yet been deployed
    error ContractNotYetDeployed();

    /// @notice Returns the address of the AxiomV2Query contract on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2Query contract
    /// @return addr The address of the AxiomV2Query contract
    function axiomV2QueryAddress(uint64 chainId) public pure returns (address addr) {
        if (chainId == MAINNET_CHAIN_ID) {
            addr = AXIOM_V2_QUERY_ADDRESS;
        } else if (chainId == BASE_CHAIN_ID) {
            addr = BASE_AXIOM_V2_QUERY_ADDRESS;
        } else {
            revert ContractDoesNotExistForChainId();
        }
        if (addr == address(0)) {
            revert ContractNotYetDeployed();
        }
    }

    /// @notice Returns the address of the cross-chain version of the AxiomV2Query contract on the chain corresponding to `chainId`
    /// @param targetChainId The chainId of the AxiomV2Query contract
    /// @param sourceChainId The chainId of the source chain
    /// @param isBlockhashOracle Whether the contract uses a blockhash oracle
    /// @param bridgeId The bridgeId used
    /// @return addr The address of the AxiomV2Query contract
    function axiomV2QueryCrosschainAddress(
        uint64 targetChainId,
        uint64 sourceChainId,
        bool isBlockhashOracle,
        uint8 bridgeId
    ) public pure returns (address addr) {
        if (targetChainId == BASE_CHAIN_ID && sourceChainId == MAINNET_CHAIN_ID && isBlockhashOracle) {
            revert ContractDoesNotExistForChainId();
        } else {
            revert ContractDoesNotExistForChainId();
        }
        if (addr == address(0)) {
            revert ContractNotYetDeployed();
        }
    }

    /// @notice Returns the address of the AxiomV2QueryMock contract on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2QueryMock contract
    /// @return addr The address of the AxiomV2QueryMock contract
    function axiomV2QueryMockAddress(uint64 chainId) public pure returns (address addr) {
        if (chainId == MAINNET_CHAIN_ID) {
            revert ContractDoesNotExistForChainId();
        } else if (chainId == SEPOLIA_CHAIN_ID) {
            addr = SEPOLIA_AXIOM_V2_QUERY_MOCK_ADDRESS;
        } else if (chainId == BASE_SEPOLIA_CHAIN_ID) {
            addr = BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_ADDRESS;
        } else {
            revert ContractDoesNotExistForChainId();
        }
        if (addr == address(0)) {
            revert ContractNotYetDeployed();
        }
    }

    /// @notice Returns the address of the AxiomV2QueryMock contract on the chain corresponding to `chainId`
    /// @param targetChainId The chainId of the AxiomV2QueryMock contract
    /// @param sourceChainId The chainId of the source chain
    /// @param isBlockhashOracle Whether the contract uses a blockhash oracle
    /// @param bridgeId The bridgeId used
    /// @return addr The address of the AxiomV2QueryMock contract
    function axiomV2QueryMockCrosschainAddress(
        uint64 targetChainId,
        uint64 sourceChainId,
        bool isBlockhashOracle,
        uint8 bridgeId
    ) public pure returns (address addr) {
        if (targetChainId == BASE_SEPOLIA_CHAIN_ID && sourceChainId == SEPOLIA_CHAIN_ID && isBlockhashOracle) {
            addr = BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_CROSSCHAIN_ADDRESS;
        } else {
            revert ContractDoesNotExistForChainId();
        }
        if (addr == address(0)) {
            revert ContractNotYetDeployed();
        }
    }

    /// @notice Returns the address of the AxiomV2Core contract on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2Core contract
    /// @return addr The address of the AxiomV2Core contract
    function axiomV2CoreAddress(uint64 chainId) public pure returns (address addr) {
        if (chainId == MAINNET_CHAIN_ID) {
            addr = AXIOM_V2_CORE_ADDRESS;
        } else if (chainId == BASE_CHAIN_ID) {
            addr = BASE_AXIOM_V2_CORE_ADDRESS;
        } else {
            revert ContractDoesNotExistForChainId();
        }
        if (addr == address(0)) {
            revert ContractNotYetDeployed();
        }
    }

    /// @notice Returns the address of the AxiomV2CoreMock contract on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2CoreMock contract
    /// @return addr The address of the AxiomV2CoreMock contract
    function axiomV2CoreMockAddress(uint64 chainId) public pure returns (address addr) {
        if (chainId == MAINNET_CHAIN_ID) {
            revert ContractDoesNotExistForChainId();
        } else if (chainId == SEPOLIA_CHAIN_ID) {
            addr = SEPOLIA_AXIOM_V2_CORE_MOCK_ADDRESS;
        } else if (chainId == BASE_SEPOLIA_CHAIN_ID) {
            addr = BASE_SEPOLIA_AXIOM_V2_CORE_MOCK_ADDRESS;
        } else {
            revert ContractDoesNotExistForChainId();
        }
        if (addr == address(0)) {
            revert ContractNotYetDeployed();
        }
    }

    /// @notice Returns the block number at which the AxiomV2Query contract was deployed on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2Query contract
    /// @return blockNumber The block number at which the AxiomV2Query contract was deployed
    function axiomV2QueryDeployBlock(uint64 chainId) public pure returns (uint256 blockNumber) {
        if (chainId == MAINNET_CHAIN_ID) {
            blockNumber = AXIOM_V2_QUERY_DEPLOY_BLOCK;
        } else if (chainId == BASE_CHAIN_ID) {
            blockNumber = BASE_AXIOM_V2_QUERY_DEPLOY_BLOCK;
        } else {
            revert ContractDoesNotExistForChainId();
        }
    }

    /// @notice Returns the block number at which the crosschain AxiomV2Query contract was deployed on the chain corresponding to `targetChainId`
    /// @param targetChainId The chainId of the AxiomV2Query contract
    /// @param sourceChainId The chainId of the source chain
    /// @param isBlockhashOracle Whether the contract uses a blockhash oracle
    /// @param bridgeId The bridgeId used
    /// @return blockNumber The block number at which the AxiomV2Query contract was deployed
    function axiomV2QueryCrosschainDeployBlock(
        uint64 targetChainId,
        uint64 sourceChainId,
        bool isBlockhashOracle,
        uint8 bridgeId
    ) public pure returns (uint256 blockNumber) {
        if (targetChainId == BASE_CHAIN_ID && sourceChainId == MAINNET_CHAIN_ID && isBlockhashOracle) {
            revert ContractDoesNotExistForChainId();
        } else {
            revert ContractDoesNotExistForChainId();
        }
    }

    /// @notice Returns the block number at which the AxiomV2QueryMock contract was deployed on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2QueryMock contract
    /// @return blockNumber The block number at which the AxiomV2QueryMock contract was deployed
    function axiomV2QueryMockDeployBlock(uint64 chainId) public pure returns (uint256 blockNumber) {
        if (chainId == MAINNET_CHAIN_ID) {
            revert ContractDoesNotExistForChainId();
        } else if (chainId == SEPOLIA_CHAIN_ID) {
            blockNumber = SEPOLIA_AXIOM_V2_QUERY_MOCK_DEPLOY_BLOCK;
        } else if (chainId == BASE_SEPOLIA_CHAIN_ID) {
            blockNumber = BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_DEPLOY_BLOCK;
        } else {
            revert ContractDoesNotExistForChainId();
        }
    }

    /// @notice Returns the block number at which the crosschain AxiomV2QueryMock contract was deployed on the chain corresponding to `targetChainId`
    /// @param targetChainId The chainId of the AxiomV2QueryMock contract
    /// @param sourceChainId The chainId of the source chain
    /// @param isBlockhashOracle Whether the contract uses a blockhash oracle
    /// @param bridgeId The bridgeId used
    /// @return blockNumber The block number at which the AxiomV2QueryMock contract was deployed
    function axiomV2QueryMockCrosschainDeployBlock(
        uint64 targetChainId,
        uint64 sourceChainId,
        bool isBlockhashOracle,
        uint8 bridgeId
    ) public pure returns (uint256 blockNumber) {
        if (targetChainId == BASE_SEPOLIA_CHAIN_ID && sourceChainId == SEPOLIA_CHAIN_ID && isBlockhashOracle) {
            blockNumber = BASE_SEPOLIA_AXIOM_V2_QUERY_MOCK_CROSSCHAIN_DEPLOY_BLOCK;
        } else {
            revert ContractDoesNotExistForChainId();
        }
    }

    /// @notice Returns the block number at which the AxiomV2Core contract was deployed on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2Core contract
    /// @return blockNumber The block number at which the AxiomV2Core contract was deployed
    function axiomV2CoreDeployBlock(uint64 chainId) public pure returns (uint256 blockNumber) {
        if (chainId == MAINNET_CHAIN_ID) {
            blockNumber = AXIOM_V2_CORE_DEPLOY_BLOCK;
        } else if (chainId == BASE_CHAIN_ID) {
            blockNumber = BASE_AXIOM_V2_CORE_DEPLOY_BLOCK;
        } else {
            revert ContractDoesNotExistForChainId();
        }
    }

    /// @notice Returns the block number at which the AxiomV2CoreMock contract was deployed on the chain corresponding to `chainId`
    /// @param chainId The chainId of the AxiomV2CoreMock contract
    /// @return blockNumber The block number at which the AxiomV2CoreMock contract was deployed
    function axiomV2CoreMockDeployBlock(uint64 chainId) public pure returns (uint256 blockNumber) {
        if (chainId == MAINNET_CHAIN_ID) {
            revert ContractDoesNotExistForChainId();
        } else if (chainId == SEPOLIA_CHAIN_ID) {
            blockNumber = SEPOLIA_AXIOM_V2_CORE_MOCK_DEPLOY_BLOCK;
        } else if (chainId == BASE_SEPOLIA_CHAIN_ID) {
            blockNumber = BASE_SEPOLIA_AXIOM_V2_CORE_MOCK_DEPLOY_BLOCK;
        } else {
            revert ContractDoesNotExistForChainId();
        }
    }
}
