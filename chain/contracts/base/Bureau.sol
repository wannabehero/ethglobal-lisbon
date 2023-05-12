// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";

abstract contract Bureau is AccessControl {
    bytes32 public constant HELPER_ROLE = keccak256("HELPER_ROLE");
    bytes32 public constant LENDER_ROLE = keccak256("LENDER_ROLE");

    string private _name;

    modifier onlyHelper() {
        require(hasRole(HELPER_ROLE, msg.sender), "Caller is not a helper");
        _;
    }

    modifier onlyLender() {
        require(hasRole(LENDER_ROLE, msg.sender), "Caller is not a lender");
        _;
    }

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
}
