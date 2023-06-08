// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Bureau } from "../base/Bureau.sol";
import { Helper } from "../base/Helper.sol";
import { PlonkVerifier } from "../PlonkVerifier.sol";

contract TrueLayerHelper is Helper {
    error InvalidProof();

    PlonkVerifier private immutable _verifier;

    constructor(Bureau bureau_, PlonkVerifier verifier_) Helper(bureau_) {
        _verifier = verifier_;
    }

    function verify(uint256 target, bytes calldata proof) external {
        uint[] memory input = new uint[](1);
        input[0] = target;

        if (!_verifier.verifyProof(proof, input)) {
            revert InvalidProof();
        }

        // TODO: add variable part based on target

        _bureau.verify(_msgSender());
    }
}
