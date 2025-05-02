// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract StudentCourse {
    address public owner;

    struct Student {
        address wallet;
        string course;
        uint grade;
        bool rewarded;
    }

    mapping(address => Student) public students;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function enroll(
        address studentWallet,
        string memory courseName
    ) public onlyOwner {
        students[studentWallet] = Student(studentWallet, courseName, 0, false);
    }

    function setGrade(address studentWallet, uint grade) public onlyOwner {
        students[studentWallet].grade = grade;
    }

    function issueReward(address studentWallet) public onlyOwner {
        require(students[studentWallet].grade >= 70, "Grade too low");
        require(!students[studentWallet].rewarded, "Already rewarded");
        students[studentWallet].rewarded = true;
    }
}
