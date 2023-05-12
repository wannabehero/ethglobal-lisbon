// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { Bureau } from "../base/Bureau.sol";
import { Helper } from "../base/Helper.sol";

contract MockHelper is Helper {
    constructor(Bureau bureau_) Helper(bureau_) {}

    function verifyMe() external {
        _bureau.verify(_msgSender());
    }
}