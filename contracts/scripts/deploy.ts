import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    const DiplomaCredential = await ethers.getContractFactory("DiplomaCredential");
    const diplomaContract = await DiplomaCredential.deploy();
    await diplomaContract.waitForDeployment();
    const diplomaAddress = diplomaContract.target;

    const CourseToken = await ethers.getContractFactory("CourseToken");
    const tokenContract = await CourseToken.deploy();
    await tokenContract.waitForDeployment();
    const tokenAddress = tokenContract.target;

    const diplomaABI = JSON.parse(
        fs.readFileSync("artifacts/contracts/DiplomaCredential.sol/DiplomaCredential.json", "utf8")
    ).abi;

    const tokenABI = JSON.parse(
        fs.readFileSync("artifacts/contracts/CourseToken.sol/CourseToken.json", "utf8")
    ).abi;

    const outputPath = path.resolve(__dirname, "../../src/web3/contract.ts");

    const output = `
export const diplomaAddress = "${diplomaAddress}";
export const diplomaABI = ${JSON.stringify(diplomaABI, null, 2)};

export const tokenAddress = "${tokenAddress}";
export const tokenABI = ${JSON.stringify(tokenABI, null, 2)};
    `;

    const [deployer] = await ethers.getSigners();
    console.log("Contract deployed by:", await deployer.getAddress());

    fs.writeFileSync(outputPath, output.trim());
    console.log(`Contracts deployed successfully!`);
    console.log(`DiplomaCredential: ${diplomaAddress}`);
    console.log(`CourseToken: ${tokenAddress}`);
    console.log(`ABI and addresses saved to contract.ts`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
