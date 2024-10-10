


import React, { useState, useEffect, useCallback, useMemo} from 'react';
import Web3 from 'web3';
import './App.css';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [totalFunds, setTotalFunds] = useState('0');
  const [expenseCounter, setExpenseCounter] = useState(0);
  const [minApprovalPercentage, setMinApprovalPercentage] = useState(0);

  const [depositAmount, setDepositAmount] = useState('');
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseId, setExpenseId] = useState('');


   // Memoize the ABI to ensure it's not redefined on every render
  const contractABI = useMemo(() => [
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_members",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "_minApprovalPercentage",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ExpenseApproved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "rejector",
          "type": "address"
        }
      ],
      "name": "ExpenseRejected",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "submitter",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ExpenseSubmitted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "member",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsDeposited",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "approvals",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_expenseId",
          "type": "uint256"
        }
      ],
      "name": "approveExpense",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "contributions",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "depositFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "expenseCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "expenses",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "submitter",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "approvalCount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_expenseId",
          "type": "uint256"
        }
      ],
      "name": "getExpenseDetails",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGroupDetails",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "groupMembers",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "groupSize",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_expenseId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_member",
          "type": "address"
        }
      ],
      "name": "hasApproved",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minApprovalPercentage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_expenseId",
          "type": "uint256"
        }
      ],
      "name": "rejectExpense",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        }
      ],
      "name": "submitExpense",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalFunds",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ], []); // Empty array ensures this is computed once and never recomputed
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';  // Replace with your deployed contract address

  // Memoize loadBlockchainData to avoid unnecessary re-renders
  const loadBlockchainData = useCallback(async () => {
    const web3 = window.web3;
    if (web3) {
      try {
        const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
        setContract(contractInstance);

        const totalFundsInWei = await contractInstance.methods.totalFunds().call();
        setTotalFunds(web3.utils.fromWei(totalFundsInWei, 'ether'));

        const expenseCounterValue = await contractInstance.methods.expenseCounter().call();
        setExpenseCounter(expenseCounterValue);

        const minApprovalValue = await contractInstance.methods.minApprovalPercentage().call();
        setMinApprovalPercentage(minApprovalValue);
      } catch (error) {
        console.error("Error loading contract data:", error);
      }
    } else {
      console.error("Web3 is not initialized.");
    }
  }, [contractABI, contractAddress]);

  // Memoize loadWeb3 to avoid unnecessary re-renders
  const loadWeb3 = useCallback(async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        window.web3 = web3;
        loadBlockchainData();  // Call loadBlockchainData after initializing web3
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert('Please install MetaMask to use this DApp.');
    }
  }, [loadBlockchainData]);

  // Load web3 and contract data on component mount
  useEffect(() => {
    loadWeb3();
  }, [loadWeb3]);

  // Deposit funds to the contract
  const depositFunds = async () => {
    if (contract && depositAmount) {
      const web3 = window.web3;
      await contract.methods.depositFunds().send({
        from: account,
        value: web3.utils.toWei(depositAmount, 'ether')
      });
      alert('Funds deposited successfully');
    }
  };

  // Submit a new expense to the contract
  const submitExpense = async () => {
    if (contract && expenseDescription && expenseAmount && expenseCategory) {
      await contract.methods
        .submitExpense(expenseDescription, expenseAmount, expenseCategory)
        .send({ from: account });
      alert('Expense submitted successfully');
    }
  };

  // Approve an expense
  const approveExpense = async () => {
    if (contract && expenseId) {
      await contract.methods.approveExpense(expenseId).send({ from: account });
      alert('Expense approved successfully');
    }
  };

  return (
    <div className="container">
      <h1>Decentralized Expense Index (DEI) Group Budgeting</h1>
      <p>Connected Account: {account}</p>
      <p>Total Funds: {totalFunds} ETH</p>
      <p>Expense Counter: {expenseCounter}</p>
      <p>Minimum Approval Percentage: {minApprovalPercentage}%</p>

      <div className="section">
        <h2>Deposit Funds</h2>
        <input
          type="text"
          placeholder="Amount in ETH"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button onClick={depositFunds}>Deposit Funds</button>
      </div>

      <div className="section">
        <h2>Submit a New Expense</h2>
        <input
          type="text"
          placeholder="Description"
          value={expenseDescription}
          onChange={(e) => setExpenseDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount in Wei"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        />
        <button onClick={submitExpense}>Submit Expense</button>
      </div>

      <div className="section">
        <h2>Approve an Expense</h2>
        <input
          type="text"
          placeholder="Expense ID"
          value={expenseId}
          onChange={(e) => setExpenseId(e.target.value)}
        />
        <button onClick={approveExpense}>Approve Expense</button>
      </div>
    </div>
  );
};

export default App;
