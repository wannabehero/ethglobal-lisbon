// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Bureau } from "../base/Bureau.sol";
import { Helper } from "../base/Helper.sol";
import { Verifier } from "../ZKVerifier.sol";

contract TrueLayerHelper is Helper {
    error InvalidProof();

    Verifier private immutable _verifier;

    constructor(Bureau bureau_, Verifier verifier_) Helper(bureau_) {
        _verifier = verifier_;
    }

    function verify(uint256 target, Verifier.Proof calldata proof) external {
        uint[1] memory input = [target];

        if (!_verifier.verifyTx(proof, input)) {
            revert InvalidProof();
        }

        // TODO: add variable part based on target

        _bureau.verify(_msgSender());
    }
}
