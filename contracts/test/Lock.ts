import { expect } from "chai";
import { ethers } from "hardhat";
import { DiplomaCredential } from "../typechain-types/contracts/DiplomaCredential";

describe("DiplomaCredential", function () {
  let diploma: DiplomaCredential;
  let owner: any;
  let student: any;

  beforeEach(async function () {
    [owner, student] = await ethers.getSigners();

    const DiplomaFactory = await ethers.getContractFactory("DiplomaCredential");
    diploma = (await DiplomaFactory.deploy()) as DiplomaCredential;
    await diploma.waitForDeployment();
  });

  it("should issue a credential to a student", async function () {
    const tx = await diploma.issueCredential(
      student.address,
      "André Costa",
      "MSc in Artificial Intelligence",
      "ISCTE"
    );
    await tx.wait();

    const credential = await diploma.getCredential(student.address);

    expect(credential.studentName).to.equal("André Costa");
    expect(credential.degree).to.equal("MSc in Artificial Intelligence");
    expect(credential.university).to.equal("ISCTE");
    expect(credential.issued).to.equal(true);
  });

  it("should not allow re-issuing a credential to the same student", async function () {
    await diploma.issueCredential(
      student.address,
      "André Costa",
      "MSc in AI",
      "ISCTE"
    );

    await expect(
      diploma.issueCredential(
        student.address,
        "André Costa",
        "MSc in AI",
        "ISCTE"
      )
    ).to.be.revertedWith("Credential already issued");
  });

  it("should not return credentials for students without one", async function () {
    await expect(diploma.getCredential(student.address)).to.be.revertedWith(
      "No credential issued to this student"
    );
  });
});
