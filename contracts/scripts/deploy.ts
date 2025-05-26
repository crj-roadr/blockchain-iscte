import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    const DiplomaCredential = await ethers.getContractFactory("DiplomaCredential");
    const contract = await DiplomaCredential.deploy();
    await contract.waitForDeployment();


    const contractAddress = contract.target;

    const contractABI = JSON.parse(
        fs.readFileSync("artifacts/contracts/DiplomaCredential.sol/DiplomaCredential.json", "utf8")
    ).abi;

    const outputPath = path.resolve(__dirname, "../../src/web3/contract.ts");

    const output = `
export const contractAddress = "${contractAddress}";
export const contractABI = ${JSON.stringify(contractABI, null, 2)};
    `;

    const [deployer] = await ethers.getSigners();
    console.log("Contract deployed by:", await deployer.getAddress());

    fs.writeFileSync(outputPath, output.trim());
    console.log(`Contract deployed to: ${contractAddress}`);
    console.log(`ABI and address saved to contract.ts`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
