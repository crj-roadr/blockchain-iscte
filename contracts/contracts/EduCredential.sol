// contracts/DiplomaNFT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract DiplomaNFT is ERC721 {
    uint256 private _tokenIds;

    mapping(address => bool) public hasDiploma;

    constructor() ERC721("DiplomaNFT", "DIP") {}

    function mintDiploma(address student) external {
        require(!hasDiploma[student], "Already has diploma");
        _tokenIds++;
        _mint(student, _tokenIds);
        hasDiploma[student] = true;
    }
}
