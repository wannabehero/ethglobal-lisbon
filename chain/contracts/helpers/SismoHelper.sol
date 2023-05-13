// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@sismo-core/sismo-connect-solidity/contracts/libs/SismoLib.sol";
import { Bureau } from "../base/Bureau.sol";
import { Helper } from "../base/Helper.sol";

contract SismoHelper is Helper, SismoConnect {
    event ProofAccepted(address indexed sender, uint256 indexed id);

    error InvalidProof();

    constructor(Bureau bureau_, bytes16 appId_)
        Helper(bureau_)
        SismoConnect(appId_)
    {}

    function verify(bytes16 groupId, bytes memory proof) external {
        SismoConnectVerifiedResult memory result = verify({
            responseBytes: proof,
            claim: buildClaim({groupId: groupId})
        });

        if (result.claims.length == 0) {
            revert InvalidProof();
        }

        // _bureau.verify(_msgSender());

        emit ProofAccepted(_msgSender(), result.claims[0].proofId);
    }
}
