// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { IWorldID } from "../interfaces/IWorldID.sol";

contract MockWorldID is IWorldID {
    // do nothing, i.e. verify successfully
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view {}
}
