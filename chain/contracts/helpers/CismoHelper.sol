// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Bureau } from "../base/Bureau.sol";
import { Helper } from "../base/Helper.sol";

contract CismoHelper is Helper {
    Bureau private immutable _bureau;

    constructor(Bureau bureau_) {
        _bureau = bureau_;
    }
}
