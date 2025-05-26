
# Step-by-step to configure a local network:
# Important: Ensure .env is created in the project_folder/contracts folder

1. To run a local blockchain use the following (location must be project_folder/contracts):
```shell
npx hardhat node
```

2. Then, in the console some accounts are shown. Save the key in the .env folder (private_key_local), and import the account to your wallet (using the same private key).

3. Deploy the contract using the following command:
```shell
npx hardhat run scripts/deploy.ts --network localhost
```


Run the following command to deploy the smart contract to the network:
# Note: network variable can be either localhost (local network) or amoy (public)

```shell
npx hardhat run scripts/deploy.ts --network {network} 
```

Then run the following command with the result of the previous one (public networks only):

```shell
npx hardhat verify --network {network} {contract_code}
```