// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

/// @dev https://github.com/worldcoin/world-id-starter-hardhat/blob/7dd7e6d5da0dceeb93a0286932bf713522912140/contracts/helpers/ByteHasher.sol
library ByteHasher {
    /// @dev Creates a keccak256 hash of a bytestring.
    /// @param value The bytestring to hash
    /// @return The hash of the specified value
    /// @dev `>> 8` makes sure that the result is included in our field
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}
