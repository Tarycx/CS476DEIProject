// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedExpenseIndexGroup {

    // Structure to store details of each expense
    struct Expense {
        uint id;
        address submitter;
        string description;
        uint amount;
        string category;
        bool approved;
        uint approvalCount;
        uint timestamp;
    }

    address public admin;
    uint public expenseCounter;
    uint public totalFunds;
    
    mapping(address => bool) public groupMembers; //Track group members
    mapping(address => uint) public contributions; //Track each member's contribution
    mapping(uint => Expense) public expenses; //Map expense IDs to expenses
    mapping(uint => mapping(address => bool)) public approvals; //Map expense ID to approvers

    uint public groupSize;
    uint public minApprovalPercentage; //Minimum percentage of approvals required

    // Events
    event ExpenseSubmitted(uint id, address indexed submitter, string description, uint amount, string category, uint timestamp);
    event ExpenseApproved(uint id, address indexed approver);
    event ExpenseRejected(uint id, address indexed rejector);
    event FundsDeposited(address indexed member, uint amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can perform this action");
        _;
    }

    modifier onlyGroupMember() {
        require(groupMembers[msg.sender], "Only group members can perform this action");
        _;
    }

    modifier expenseExists(uint _expenseId) {
        require(expenses[_expenseId].id == _expenseId, "Expense does not exist.");
        _;
    }

    constructor(address[] memory _members, uint _minApprovalPercentage) {
        require(_minApprovalPercentage > 0 && _minApprovalPercentage <= 100, "Invalid approval percentage");

        admin = msg.sender;
        minApprovalPercentage = _minApprovalPercentage;

        for (uint i = 0; i < _members.length; i++) {
            groupMembers[_members[i]] = true;
        }

        groupSize = _members.length;
    }

    // Function to deposit funds into the group budget
    function depositFunds() public payable onlyGroupMember {
        require(msg.value > 0, "Must deposit a positive amount");
        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;

        emit FundsDeposited(msg.sender, msg.value);
    }

    // Function to submit a new expense
    function submitExpense(string memory _description, uint _amount, string memory _category) public onlyGroupMember {
        require(_amount <= totalFunds, "Not enough funds in the budget");

        expenseCounter++;  //Increment expense counter
        expenses[expenseCounter] = Expense({
            id: expenseCounter,
            submitter: msg.sender,
            description: _description,
            amount: _amount,
            category: _category,
            approved: false,
            approvalCount: 0,
            timestamp: block.timestamp
        });

        emit ExpenseSubmitted(expenseCounter, msg.sender, _description, _amount, _category, block.timestamp);
    }

    // Function to approve an expense
    function approveExpense(uint _expenseId) public onlyGroupMember expenseExists(_expenseId) {
        Expense storage expense = expenses[_expenseId];

        require(!expense.approved, "Expense is already approved");
        require(!approvals[_expenseId][msg.sender], "You have already approved this expense");

        approvals[_expenseId][msg.sender] = true;
        expense.approvalCount++;

        emit ExpenseApproved(_expenseId, msg.sender);

        // Check if the expense has enough approvals
        uint requiredApprovals = (minApprovalPercentage * groupSize) / 100;
        if (expense.approvalCount >= requiredApprovals) {
            expense.approved = true;
        }
    }

    // Function to reject an expense
    function rejectExpense(uint _expenseId) public onlyGroupMember expenseExists(_expenseId) {
        Expense storage expense = expenses[_expenseId];

        require(!expense.approved, "Expense is already approved");
        require(approvals[_expenseId][msg.sender], "You have not approved this expense");

        approvals[_expenseId][msg.sender] = false;
        if (expense.approvalCount > 0) {
            expense.approvalCount--;
        }

        emit ExpenseRejected(_expenseId, msg.sender);
    }

    // Function to view group details
    function getGroupDetails() public view returns (uint, uint, uint, uint) {
        return (groupSize, totalFunds, expenseCounter, minApprovalPercentage);
    }

    // Function to view an expense's details
    function getExpenseDetails(uint _expenseId) public view expenseExists(_expenseId) returns (uint, address, string memory, uint, string memory, bool, uint, uint) {
        Expense memory expense = expenses[_expenseId];
        return (
            expense.id,
            expense.submitter,
            expense.description,
            expense.amount,
            expense.category,
            expense.approved,
            expense.approvalCount,
            expense.timestamp
        );
    }

    // Function to check if a group member has approved an expense
    function hasApproved(uint _expenseId, address _member) public view expenseExists(_expenseId) returns (bool) {
        return approvals[_expenseId][_member];
    }
}
