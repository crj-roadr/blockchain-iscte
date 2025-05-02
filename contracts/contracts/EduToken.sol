// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EduToken is ERC20 {
    address public admin;

    constructor() ERC20("EduToken", "EDU") {
        admin = msg.sender;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == admin, "Only admin can mint");
        _mint(to, amount);
    }

    // function _transfer(
    //     address from,
    //     address to,
    //     uint256 amount
    // ) internal virtual override {
    //     require(
    //         from == address(0) || to == address(0),
    //         "Token is non-transferable"
    //     );
    //     super._transfer(from, to, amount);
    // }
}
