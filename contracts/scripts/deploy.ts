import { ethers } from "hardhat";

async function main() {
    const DiplomaFactory = await ethers.getContractFactory("DiplomaCredential");
    const diploma = await DiplomaFactory.deploy();
    await diploma.waitForDeployment();

    console.log(`DiplomaCredential deployed at ${diploma.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
