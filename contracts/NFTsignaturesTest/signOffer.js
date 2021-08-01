
const Web3 = require('web3');
const web3 = new Web3();
const myAccount = require('./testAccount.json');

const account = web3.eth.accounts.privateKeyToAccount(myAccount.privateKey);

const nftfiBody = {
  loanPrincipalAmount: "5000000000000000000",
  maximumRepaymentAmount: "5009589000000000000",
  nftCollateralId: "707",
  loanDuration: 604800,
  loanInterestRateForDurationInBasisPoints: "4294967295",
  adminFeeInBasisPoints: "500",
  lenderNonce:"77447815385563749389707693204129092952160649971788289514428829746067408853135",
  nftCollateralContract: "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d",
  loanERC20Denomination: "0x6b175474e89094c44da98b954eedeac495271d0f",
  lender: "0x9B7E6ac5D64b5bAd557d09d92c70a38F4bf1395a",
  borrower: "0x3f86f18322a888d9b3adef38f127c941bccc014d",
  interestIsProRated: false,
  signedMessage:"0x3cc19b392d52ce67ff8b34e4d709799eac2a619b9e4860284dc3b63a45f766ba3b6301338b4483b6346e821e5990075812cc80a3e8c5b7177ea129ecc118fb1a1c",
};
const body = {
  loanPrincipalAmount: "5000000000000000000",
  maximumRepaymentAmount: "5009589000000000000",
  nftCollateralId: "707",
  loanDuration: 604800,
  loanInterestRateForDurationInBasisPoints: "4294967295",
  adminFeeInBasisPoints: "500",
  lenderNonce: "82613987153658272838157898619918933692742819077316924280450055694179944713142",
  nftCollateralContract: "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d",
  loanERC20Denomination: "0x6b175474e89094c44da98b954eedeac495271d0f",
  lender: "0x9B7E6ac5D64b5bAd557d09d92c70a38F4bf1395a",
  borrower: "0x3f86f18322a888d9b3adef38f127c941bccc014d",
  interestIsProRated: false  
};

const contractBody = {
  loanPrincipalAmount: "5000000000000000000",
  maximumRepaymentAmount: "5009589000000000000",
  nftCollateralId: "707",
  loanDuration: 604800,
  loanInterestRateForDurationInBasisPoints: "4294967295",
  adminFeeInBasisPoints: "500",
  lenderNonce: "77447815385563749389707693204129092952160649971788289514428829746067408853135",
  nftCollateralContract: "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d",
  loanERC20Denomination: "0x6b175474e89094c44da98b954eedeac495271d0f",
  lender: "0x9B7E6ac5D64b5bAd557d09d92c70a38F4bf1395a",
  interestIsProRated: false,
  chainId: 1  
};


const string = JSON.stringify(contractBody);

const messageHash = web3.utils.sha3(string);
console.log(messageHash);
debugger;


const hashedCompMsg = web3.utils.keccak256("\x19Ethereum Signed Message:\n32",messageHash);
console.log(hashedCompMsg);
debugger;

async function sign(){
    
    const signedMessage = await account.sign(hashedCompMsg);
    console.log("signed Message",signedMessage);
    debugger;
    
    
    // const signedTx = await account.signTransaction(body);
    // console.log("signed Transaction",signedTx);
    // debugger;
    
}

sign();

// Expected value for signedMessage:
//   "0x92c23bbd6338e03fc3d2e54a87783ef098f8c459c9290ba6d838f32b36ef1ba831a3348bc20cf6a210013064459fab8857533a545d43c9adf891f7b341c659fa1b",
