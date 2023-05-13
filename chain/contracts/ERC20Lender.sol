// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Bureau } from "./base/Bureau.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

import "hardhat/console.sol";

contract ERC20Lender is Context {
    Bureau private immutable _bureau;
    IERC20 public immutable LENDING_TOKEN;
    IERC20 public immutable COLLATERAL_TOKEN;

    mapping (address => uint256) private _collaterals;
    mapping (address => uint256) private _loans;

    constructor(
        Bureau bureau_,
        IERC20 lendingToken_,
        IERC20 collateralToken_
    ) {
        _bureau = bureau_;
        LENDING_TOKEN = lendingToken_;
        COLLATERAL_TOKEN = collateralToken_;
    }

    function collateralBalance(address account) external view returns (uint256) {
        return _collaterals[account];
    }

    function borrowedBalance(address account) external view returns (uint256) {
        return _loans[account];
    }

    function collateralRequired(address account, uint256 amount) public view returns (uint256) {
        Bureau.Score memory score = _bureau.score(account);

        uint256 _lendingValue = _tokenValue(LENDING_TOKEN, amount);

        return _lendingValue * score.collateralCoef / 1 ether;
    }

    function borrow(uint256 amount) external {
        address account = _msgSender();

        uint256 _current = _collaterals[account];
        uint256 _required = collateralRequired(account, amount + _loans[account]);

        require(_current >= _required, "ERC20Lender: Not enough collateral");

        _loans[account] += amount;

        LENDING_TOKEN.transfer(account, amount);

        _bureau.onBorrow(account, _tokenValue(COLLATERAL_TOKEN, amount));
    }

    function repay(uint256 amount) external {
        _loans[_msgSender()] -= amount;

        LENDING_TOKEN.transferFrom(_msgSender(), address(this), amount);

        _bureau.onRepay(_msgSender(), _tokenValue(COLLATERAL_TOKEN, amount));
    }

    function increaseCollateral(uint256 amount) external {
        _collaterals[_msgSender()] += amount;

        COLLATERAL_TOKEN.transferFrom(_msgSender(), address(this), amount);

        _bureau.onIncreaseCollateral(_msgSender(), _tokenValue(COLLATERAL_TOKEN, amount));
    }

    function decreaseCollateral(uint256 amount) external {
        // TODO: can't decrease collateral if it's required for loans

        _collaterals[_msgSender()] -= amount;

        COLLATERAL_TOKEN.transfer(_msgSender(), amount);

        _bureau.onDecreaseCollateral(_msgSender(), _tokenValue(COLLATERAL_TOKEN, amount));
    }

    function liquidate(address account) external {
        // TODO: PoC logic
    }

    function _tokenValue(IERC20 token, uint256 amount) internal view returns (uint256) {
        // TODO: add uniswap/1inch to calculate price
        // in native token to report to the bureau
        return amount;
    }
}
