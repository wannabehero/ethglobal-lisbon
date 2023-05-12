// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Bureau } from "./base/Bureau.sol";
import { IWorldID } from "./interfaces/IWorldID.sol";
import { ByteHasher } from "./utils/ByteHasher.sol";

contract CryptoBureau is Bureau {
    using ByteHasher for bytes;

    struct Score {
        uint64 verified;
        uint128 base;

        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 totalCollateral;
    }

    struct HelperConfig {
        uint128 multiplier;
    }

    event Registered(uint256 indexed nullifierHash, address indexed account);

    /// @dev nullifierHash (world ID) => score
    mapping (uint256 => Score) private _scores;

    /// @dev address => nullifierHash
    mapping (address => uint256) private _accounts;

    /// @dev lenders => true
    mapping (address => bool) private _lenders;

    /// @dev helpers => config
    mapping (address => HelperConfig) private _helpers;

    /// @dev the following are world-id related variables
    IWorldID private immutable _worldId;
    uint256 private immutable _externalNullifier;

    constructor(
        IWorldID worldId_,
        string memory _appId,
        string memory _actionId
    ) Bureau("CryptoBuerau") {
        _worldId = worldId_;

        _externalNullifier = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
            .hashToField();
    }

    function _scoreForAccount(address account) internal view returns (Score storage) {
        uint256 nullifier = _accounts[account];
        require(nullifier > 0, "CryptoBureau: Account not found");
        Score storage score = _scores[nullifier];
        require(score.verified > 0, "CryptoBureau: Not verified");
        return score;
    }

    function register(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        require(_scores[nullifierHash].verified == 0, "CryptoBureau: Already registered");

        // verify the proof
        _worldId.verifyProof(
            root,
            1,
            abi.encodePacked(_msgSender()).hashToField(),
            nullifierHash,
            _externalNullifier,
            proof
        );

        _scores[nullifierHash] = Score({
            verified: uint64(block.timestamp),
            base: 0,
            totalBorrowed: 0,
            totalRepaid: 0,
            totalCollateral: 0
        });
        _accounts[_msgSender()] = nullifierHash;
    }

    // Hooks
    function onBorrow(address account, uint256 value) external virtual override onlyLender {
        Score storage score = _scoreForAccount(account);
        score.totalBorrowed += value;
    }

    function onRepay(address account, uint256 value) external virtual override onlyLender {
        Score storage score = _scoreForAccount(account);
        score.totalRepaid += value;
    }

    function onIncreaseCollateral(address account, uint256 value) external virtual override onlyLender {
        Score storage score = _scoreForAccount(account);
        score.totalCollateral += value;
    }

    function onDecreaseCollateral(address account, uint256 value) external virtual override onlyLender {
        Score storage score = _scoreForAccount(account);
        score.totalCollateral -= value;
    }

    // Management functions
    function setLender(address lender, bool status) external onlyAdmin {
        _lenders[lender] = status;
    }

    function setHelper(address helper, HelperConfig calldata config) external onlyAdmin {
        _helpers[helper] = config;
    }
}
