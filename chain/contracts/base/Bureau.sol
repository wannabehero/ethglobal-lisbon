// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract Bureau is AccessControl {
    struct ScoreData {
        uint64 verified;
        uint256 base;

        uint256 totalBorrowed;
        uint256 totalRepaid;
        uint256 totalCollateral;
    }

    struct Score {
        uint256 collateralCoef;
    }

    string private _name;

    modifier onlyAdmin() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");
        _;
    }

    constructor(string memory name_) {
        _name = name_;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function onBorrow(address account, uint256 value) external virtual;
    function onRepay(address account, uint256 value) external virtual;
    function onIncreaseCollateral(address account, uint256 value) external virtual;
    function onDecreaseCollateral(address account, uint256 value) external virtual;

    function score(address account) external view virtual returns (Score memory);

    // Helper methods
    function verify(address account) external virtual;
}
