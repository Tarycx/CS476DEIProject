
//Deployment Command
//npx hardhat run scripts/deploy.js --network localhost

//

const hre = require("hardhat");

async function main() {
    // Get the ContractFactory and Signers here.
    const [deployer] = await ethers.getSigners(); // Get the account to deploy the contract. (Account 0) 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    

    //the deployer account is the first account returned by ethers.getSigners() (Account 0)
    console.log("Deploying contract with the account:", deployer.address);
    // We get the contract to deploy
    const DEIGroup = await ethers.getContractFactory("DecentralizedExpenseIndexGroup");
  
    // Deploy the contract, passing in any required constructor arguments. Group members (Accounts 1 & 2) Account 3 for testing multiple accounts
    const deiGroup = await DEIGroup.deploy(
      ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", "0x90F79bf6EB2c4f870365E785982E1f101E93b906"], // Replace these with actual Ethereum addresses
      50 // Minimum approval percentage (all members must vote to approve)
      //Account #1: 0x7099, Account #2 0x3C44, Account #3 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (Account 3 for testing larger groups)
    );
  
  
    // Log the contract address
    console.log("Contract deployed to address:", deiGroup.target);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  