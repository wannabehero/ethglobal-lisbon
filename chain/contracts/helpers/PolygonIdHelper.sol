// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import { Bureau } from "../base/Bureau.sol";
import { Helper } from "../base/Helper.sol";

import "./xPolygonID/lib/GenesisUtils.sol";
import "./xPolygonID/verifiers/ZKPVerifier.sol";
import "./xPolygonID/interfaces/ICircuitValidator.sol";

contract PolygonIdHelper is Helper, ZKPVerifier {
    event ProofAccepted(address indexed sender, uint256 indexed id);

    uint64 public constant VERIFY_REQUEST_ID = 1;

    mapping (uint256 => address) private _submittedProofs;

    constructor(Bureau bureau_)
        Helper(bureau_)
    {}

    function _beforeProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view override {
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in proof is not a sender address"
        );
    }

    function _afterProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal override {
        require(requestId == VERIFY_REQUEST_ID, "PolygonIDHelper: Invalid request");

        uint256 id = inputs[validator.getChallengeInputIndex()];
        if (_submittedProofs[id] == address(0)) {
            // _bureau.verify(_msgSender());
            _submittedProofs[id] = _msgSender();

            emit ProofAccepted(_msgSender(), id);
        }
    }

    /// @dev due to the bug with PolygonID app it only works with `name()`
    function name() public view returns (string memory) {
        return "CryptoBureau";
    }
}
