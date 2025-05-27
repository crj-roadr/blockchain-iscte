// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CourseToken is ERC20 {
    address public admin;

    constructor() ERC20("CourseToken", "CTKN") {
        admin = msg.sender;
        _mint(admin, 1000000 * 10 ** decimals());
    }

    function rewardTokens(address student, uint256 amount) external {
        // require(msg.sender == admin, "Only admin can reward tokens");
        _transfer(admin, student, amount);
    }
}
