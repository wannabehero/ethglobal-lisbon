// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { Bureau } from "../base/Bureau.sol";

abstract contract Helper is Context {
    Bureau immutable _bureau;

    constructor(Bureau bureau_) {
        _bureau = bureau_;
    }
}
