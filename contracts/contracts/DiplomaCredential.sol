// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DiplomaCredential is Ownable {
    struct Credential {
        string studentName;
        string degree;
        string university;
        uint256 issueDate;
        bool issued;
        string diploma_type;
    }

    mapping(address => Credential) public credentials;

    event CredentialIssued(address indexed student, string degree);

    constructor() Ownable(msg.sender) {}

    function issueCredential(
        address student,
        string memory studentName,
        string memory degree,
        string memory diploma_type
    ) external onlyOwner {
        require(!credentials[student].issued, "Credential already issued");

        credentials[student] = Credential({
            studentName: studentName,
            degree: degree,
            university: "ISCTE",
            issueDate: block.timestamp,
            issued: true,
            diploma_type: diploma_type
        });

        emit CredentialIssued(student, degree);
    }

    function getCredential(
        address student
    ) external view returns (Credential memory) {
        require(
            credentials[student].issued,
            "No credential issued to this student"
        );
        return credentials[student];
    }

    modifier preventTransfer(address from, address to) {
        require(
            from == address(0) || to == address(0),
            "Credentials are non-transferable"
        );
        _;
    }
}
