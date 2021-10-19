import { ethers } from 'ethers';

export interface Loan {
    loanID: ethers.BigNumber;
    lender: string;
    borrower: string;
    asmartContractAddressOfNFT: string;
    tokenIdNFT: number;
    loanAmount: ethers.BigNumber;     //Amount borrow + interest amount
    interestAmount: ethers.BigNumber; //Total amount of interest to pay at the end of the loan
    maximumPeriod: ethers.BigNumber;   //Max number of months
    endLoanTimeStamp: ethers.BigNumber;
}

