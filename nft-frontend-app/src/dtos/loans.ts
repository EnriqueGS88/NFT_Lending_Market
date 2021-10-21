import { ethers } from 'ethers';

export interface Loans {
    loanID: ethers.BigNumber;
    nftPrice: number;
    lender: string;
    borrower: string;
    smartContractAddressOfNFT: string;
    tokenIdNFT: number;
    loanAmount: ethers.BigNumber;     //Amount borrow + interest amount
    interestAmount: ethers.BigNumber; //Total amount of interest to pay at the end of the loan
    maximumPeriod: ethers.BigNumber;   //Max number of months
    endLoanTimeStamp: ethers.BigNumber;
}

