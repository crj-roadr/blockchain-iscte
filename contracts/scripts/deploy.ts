import { ethers } from "hardhat";

async function main() {
    const contract = await ethers.deployContract("StudentCourse");
    await contract.waitForDeployment();
    console.log(`StudentCourse deployed at ${contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
