const { ethers } = require("hardhat");


// FIXME: ParsesEther, ParseUnits Errors

async function main() {
    // Replace with your deployed contract address
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

    // Get the contract factory and attach to the deployed contract
    const DEIGroup = await ethers.getContractFactory("DecentralizedExpenseIndexGroup");
    const deiGroup = await DEIGroup.attach(contractAddress);

    // Get signers (accounts from Hardhat)
    const [admin, member1, member2] = await ethers.getSigners();

    console.log("Admin's address:", admin.address);
    console.log("Member1's address:", member1.address);
    console.log("Member2's address:", member2.address);

    // Deposit 1 Ether directly from member1 (no conversion needed)
    const depositAmountInEther = 1;  // 1 Ether
    console.log("Member1 depositing 1 ETH...");
    const depositTx = await deiGroup.connect(member1).depositFunds({
        value: ethers.utils.parseEther(depositAmountInEther.toString())  // FIXME: ParsesEther Errors Ether value passed directly
    });
    await depositTx.wait();
    console.log("Member1 deposited 1 ETH");

    // Retrieve and display the current group details after the deposit
    const [groupSize, totalFundsInEther, expenseCounter, minApprovalPercentage] = await deiGroup.getGroupDetails();
    console.log("Group Details:");
    console.log("Group Size:", groupSize.toString());
    console.log("Total Funds:", totalFundsInEther.toString(), "ETH");  // Total funds in Ether
    console.log("Expense Counter:", expenseCounter.toString());
    console.log("Minimum Approval Percentage:", minApprovalPercentage.toString(), "%");

    // Submit a new expense by member1 (0.5 Ether for "Team Lunch")
    const expenseAmountInEther = 0.5;  // Expense in Ether (direct value, no conversion)
    console.log("Member1 submitting a new expense of 0.5 ETH for 'Team Lunch'...");
    const submitTx = await deiGroup.connect(member1).submitExpense(
        "Team Lunch", 
        expenseAmountInEther,  // Ether amount passed directly
        "Food"
    );
    await submitTx.wait();
    console.log("Member1 submitted the expense for 0.5 ETH");

    // Approve the expense by admin (assuming the expense ID is 1)
    const expenseId = 1;  // Assuming this is the first expense
    console.log("Admin approving the expense...");
    const approveTx = await deiGroup.connect(admin).approveExpense(expenseId);
    await approveTx.wait();
    console.log("Admin approved the expense");

    // Retrieve and display the details of the expense
    const expenseDetails = await deiGroup.getExpenseDetails(expenseId);
    console.log("Expense Details:");
    console.log("ID:", expenseDetails[0].toString());
    console.log("Submitter:", expenseDetails[1]);
    console.log("Description:", expenseDetails[2]);
    console.log("Amount:", expenseDetails[3].toString(), "ETH");  // Display the amount in Ether
    console.log("Category:", expenseDetails[4]);
    console.log("Approved:", expenseDetails[5]);
    console.log("Approval Count:", expenseDetails[6].toString());
    console.log("Timestamp:", new Date(expenseDetails[7] * 1000).toLocaleString());

    // Retrieve and display the updated total funds after the expense
    const updatedTotalFundsInEther = await deiGroup.totalFunds();
    console.log("Updated Total Funds:", updatedTotalFundsInEther.toString(), "ETH");  // Total funds in Ether
}

// Error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });