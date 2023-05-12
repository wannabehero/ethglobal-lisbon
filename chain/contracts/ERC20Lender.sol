// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Bureau } from "./base/Bureau.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

contract ERC20Lender is Context {
    Bureau private immutable _bureau;
    IERC20 private immutable _lendingToken;
    IERC20 private immutable _collateralToken;

    mapping (address => uint256) private _collaterals;
    mapping (address => uint256) private _loans;

    constructor(
        Bureau bureau_,
        IERC20 lendingToken_,
        IERC20 collateralToken_
    ) {
        _bureau = bureau_;
        _lendingToken = lendingToken_;
        _collateralToken = collateralToken_;
    }

    function _tokenValue(IERC20 token, uint256 amount) internal returns (uint256) {
        // TODO: add uniswap/1inch to calculate price
        // in native token to tell the bureau
        return amount;
    }

    function borrow(uint256 amount) external returns (uint256) {
        // TODO: logic
        _bureau.onBorrow(_msgSender(), _tokenValue(_collateralToken, amount));
        return 0;
    }

    function repay(uint256 amount) external returns (uint256) {
        // TODO: logic
        _bureau.onRepay(_msgSender(), _tokenValue(_collateralToken, amount));
        return 0;
    }

    function increaseCollateral(uint256 amount) external {
        // TODO: logic

        _bureau.onIncreaseCollateral(_msgSender(), _tokenValue(_collateralToken, amount));
    }

    function decreaseCollateral(uint256 amount) external {
        // TODO: logic

        _bureau.onDecreaseCollateral(_msgSender(), _tokenValue(_collateralToken, amount));
    }

    function liquidate(address account) external {
        // TODO: PoC logic
    }
}
