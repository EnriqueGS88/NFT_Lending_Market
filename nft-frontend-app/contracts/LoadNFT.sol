pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract LoanNFT is IERC721Receiver, Pausable, Ownable {

    event LoansUpdated();
    using SafeMath for uint32;
    

    enum Status { PENDING, ACTIVE, CANCELLED, ENDED, DEFAULTED }

    struct LoanRequest {
        uint256 loanID;
        address payable lender;
        address payable borrower;
        address smartContractAddressOfNFT;
        uint32 tokenIdNFT;
        uint256 loanAmount;     //Amount borrow + interest amount
        uint256 interestAmount; //Total amount of interest to pay at the end of the loan
        uint256 maximumPeriod;   //Max number of months
        uint256 endLoanTimeStamp;
        Status status;
    }

    uint public totalLoanRequests;
    mapping(uint => LoanRequest) public allLoanRequests;

    modifier isValidLoanID(uint loanID) {
        require( loanID < totalLoanRequests, "Loan ID is invalid.");
        _;
    }

    constructor()  {
        totalLoanRequests = 0;
    }

    // Equivalent to 'bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))'
    // Or this.onERC721Received.selector
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data) public override pure returns (bytes4) {
        return 0x150b7a02;
    }

    function pauseLoans() public onlyOwner {
        _pause();
    }

    function unPauseLoans() public onlyOwner {
        _unpause();
    }

    //The user can request a loan in ethr using as collateral a NFT. 
    //if someone accepts the loan (lender), will transfer ether to the user owner of the NFT.
    //at the end of the period the lender will get the loan plus an interest
    function createLoanRequest(address smartContractAddressOfNFT,
                                uint32 tokenIdNFT,
                                uint256 loanAmount,
                                uint256 interestAmount,
                                uint256 maximumPeriod) public  {
        require(interestAmount < loanAmount, "Interest must be lower than the loan.");
        require(maximumPeriod < 12, "Maximum interest periods are 12 months.");
        require(maximumPeriod > 0, "Maximum interest period cannot be 0.");

        //get the NFT
        IERC721 currentNFT = IERC721(smartContractAddressOfNFT);
        require(currentNFT.getApproved(tokenIdNFT) == address(this), "Transfer has to be approved first");

        //Save the loan request
        LoanRequest storage loanRequest =  allLoanRequests[totalLoanRequests];
        loanRequest.loanID = totalLoanRequests;
        loanRequest.lender = payable(address(0x0));
        loanRequest.borrower = payable(msg.sender);
        loanRequest.smartContractAddressOfNFT = smartContractAddressOfNFT;
        loanRequest.tokenIdNFT = tokenIdNFT;
        loanRequest.loanAmount = loanAmount;
        loanRequest.interestAmount = interestAmount;
        loanRequest.maximumPeriod = maximumPeriod;
        loanRequest.status = Status.PENDING;
        
        // Increment number of load request
        totalLoanRequests = SafeMath.add(totalLoanRequests, 1);
        
        //transfert the nft to the contract address
        currentNFT.safeTransferFrom(msg.sender, address(this), tokenIdNFT);
        emit LoansUpdated();
    }

    //The lender accepts a loan request. The NFT is deposited in the loan smart contract, and 
    function acceptLoanRequest(uint256 loanID) payable public isValidLoanID(loanID) whenNotPaused {
        require(allLoanRequests[loanID].status == Status.PENDING, "Status is PENDING for loan.");
        require(allLoanRequests[loanID].borrower != msg.sender, "Invalid operation. You cannot underwrite your own loan.");

        // The lender is require to underwrite the total loan amount minus the interest
        // For the first period of the loan
        uint256 netAmount = allLoanRequests[loanID].loanAmount - allLoanRequests[loanID].interestAmount;   
        require(msg.value >= netAmount, "Not enough Ether sent to function to underwrite loan.");

        allLoanRequests[loanID].lender = payable(msg.sender);   //the lender address is saved, it will be need it at the end of the loan
        allLoanRequests[loanID].status = 
Status.ACTIVE
;
        allLoanRequests[loanID].endLoanTimeStamp = SafeMath.add(block.timestamp, allLoanRequests[loanID].maximumPeriod);

        // The lender sends the money to the user who has requested the loan. The lenders sends the loan amount - interestAmount
        // he gets less, because the loan amount includes the interest amount.
        allLoanRequests[loanID].borrower.transfer(netAmount);   
        emit LoansUpdated();
    }

    //It is called by the borrower. He returns the loan amount to the lender
    function endLoanRequest(uint256 loanID) payable public isValidLoanID(loanID) {
        require(allLoanRequests[loanID].status == 
Status.ACTIVE
, "Status is ACTIVE to end loan.");
        require((msg.sender == allLoanRequests[loanID].lender  && block.timestamp >= allLoanRequests[loanID].endLoanTimeStamp) 
                || msg.sender == allLoanRequests[loanID].borrower, "Unable to end loan.");

        // Borrower sends loan plus the interest amount back to lender
        if (msg.sender == allLoanRequests[loanID].borrower) {
            require(msg.value >= allLoanRequests[loanID].loanAmount, "the ");
            allLoanRequests[loanID].status = Status.ENDED;
            allLoanRequests[loanID].lender.transfer(allLoanRequests[loanID].loanAmount);
        } else {
            allLoanRequests[loanID].status = Status.DEFAULTED;
        }

        // NFT is sent to the function caller (the lender or borrower).
        IERC721 currentNFT = IERC721(allLoanRequests[loanID].smartContractAddressOfNFT);
        currentNFT.approve(msg.sender, allLoanRequests[loanID].tokenIdNFT);
        currentNFT.transferFrom(address(this), msg.sender, allLoanRequests[loanID].tokenIdNFT);
        emit LoansUpdated();
    }
    
    //The borrower cancels his loan request and gets back his NFT
    function cancelLoanRequest(uint loanID) public isValidLoanID(loanID) {
        require(allLoanRequests[loanID].status == Status.PENDING, "Status is not PENDING to cancel loan request");
        require(msg.sender == allLoanRequests[loanID].borrower);

        allLoanRequests[loanID].status = Status.CANCELLED;

        IERC721 currentNFT = IERC721(allLoanRequests[loanID].smartContractAddressOfNFT);
        currentNFT.approve(msg.sender, allLoanRequests[loanID].tokenIdNFT);
        currentNFT.transferFrom(address(this), msg.sender, allLoanRequests[loanID].tokenIdNFT);
        emit LoansUpdated();
    }
} 