// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Bureau } from "./base/Bureau.sol";
import { IWorldID } from "./interfaces/IWorldID.sol";
import { ByteHasher } from "./utils/ByteHasher.sol";

// import "hardhat/console.sol";

contract CryptoBureau is Bureau {
    using ByteHasher for bytes;

    struct HelperConfig {
        uint128 multiplier;
    }

    event Registered(uint256 indexed nullifierHash, address indexed account);

    /// @dev nullifierHash (world ID) => data
    mapping (uint256 => ScoreData) private _scoreData;

    /// @dev nullifierHash => helper
    mapping (uint256 => mapping (address => bool)) private _usedHelpers;

    uint256 private _maxBaseScore = 10 ether;

    /// @dev address => nullifierHash
    mapping (address => uint256) private _accounts;

    /// @dev lenders => true
    mapping (address => bool) private _lenders;

    /// @dev helpers => config
    mapping (address => HelperConfig) private _helpers;

    /// @dev the following are world-id related variables
    IWorldID private immutable _worldId;
    uint256 private immutable _externalNullifier;

    modifier onlyHelper() {
        HelperConfig storage config = _helpers[msg.sender];
        require(config.multiplier > 0, "Caller is not a helper");
        _;
    }

    modifier onlyLender() {
        require(_lenders[msg.sender], "Caller is not a lender");
        _;
    }

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

    function _scoreDataForAccount(address account) internal view returns (ScoreData storage) {
        uint256 nullifier = _accounts[account];
        require(nullifier > 0, "CryptoBureau: Account not found");
        ScoreData storage data = _scoreData[nullifier];
        require(data.verified > 0, "CryptoBureau: Not verified");
        return data;
    }

    function register(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        require(_scoreData[nullifierHash].verified == 0, "CryptoBureau: Already registered");

        // verify the proof
        _worldId.verifyProof(
            root,
            1,
            abi.encodePacked(_msgSender()).hashToField(),
            nullifierHash,
            _externalNullifier,
            proof
        );

        _scoreData[nullifierHash] = ScoreData({
            verified: uint64(block.timestamp),
            base: 2 ether,
            totalBorrowed: 0,
            totalRepaid: 0,
            totalCollateral: 0
        });
        _accounts[_msgSender()] = nullifierHash;
    }

    function scoreData(address account) external view returns (ScoreData memory) {
        return _scoreDataForAccount(account);
    }

    function score(address account) external view override returns (Score memory) {
        ScoreData storage data = _scoreDataForAccount(account);

        uint256 maxK = 1.5 ether;
        uint256 minK = 0.5 ether;

        uint256 base;

        if (data.totalBorrowed == 0) {
            // first-timer, will pass on the base calculated k
            base = data.base;
        } else if (data.totalBorrowed > data.totalRepaid) {
            base = data.base / 2 ether; // NOTE: very basic
        } else {
            // console.log("repaid", data.totalRepaid);
            uint256 overage = data.totalRepaid * 1 ether / data.totalBorrowed;
            // console.log("overage", data.totalRepaid);
            base = data.base * overage * 1.1 ether / 1 ether / 1 ether;
        }

        if (base > _maxBaseScore) {
            base = _maxBaseScore;
        }

        // console.log(base);

        // 0.5 + 1 * (1 - 2/10) = 1.3
        uint256 k = minK + (maxK - minK) * (1 ether - base * 1 ether / _maxBaseScore) / 1 ether;

        return Score({
            collateralCoef: k
        });
    }

    // Hooks
    function onBorrow(address account, uint256 value) external override onlyLender {
        ScoreData storage data = _scoreDataForAccount(account);
        data.totalBorrowed += value;
    }

    function onRepay(address account, uint256 value) external override onlyLender {
        ScoreData storage data = _scoreDataForAccount(account);
        data.totalRepaid += value;
    }

    function onIncreaseCollateral(address account, uint256 value) external override onlyLender {
        ScoreData storage data = _scoreDataForAccount(account);
        data.totalCollateral += value;
    }

    function onDecreaseCollateral(address account, uint256 value) external override onlyLender {
        ScoreData storage data = _scoreDataForAccount(account);
        data.totalCollateral -= value;
    }

    // Helper functions
    function verify(address account) external override onlyHelper {
        HelperConfig storage config = _helpers[msg.sender];
        ScoreData storage data = _scoreDataForAccount(account);

        require(!_usedHelpers[_accounts[account]][msg.sender], "CryptoBureau: Already verified");

        _usedHelpers[_accounts[account]][msg.sender] = true;

        data.base = data.base * config.multiplier / 1 ether;

        if (data.base > _maxBaseScore) {
            _maxBaseScore = data.base;
        }
    }

    // Management functions
    function setLender(address lender, bool status) external onlyAdmin {
        _lenders[lender] = status;
    }

    function setHelper(address helper, HelperConfig calldata config) external onlyAdmin {
        _helpers[helper] = config;
    }
}
