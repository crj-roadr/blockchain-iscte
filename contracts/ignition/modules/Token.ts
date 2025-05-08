import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LockModule = buildModule("Token", (m) => {
  const token = m.contract("Token");

  return { token };
});

export default LockModule;
