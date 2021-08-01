const fetch = require("node-fetch");

// 15.06.2021

const body = {
  loanPrincipalAmount: "5000000000000000000",
  maximumRepaymentAmount: "5009589000000000000",
  nftCollateralId: "707",
  loanDuration: 604800,
  loanInterestRateForDurationInBasisPoints: "4294967295",
  adminFeeInBasisPoints: "500",
  lenderNonce:
    "82613987153658272838157898619918933692742819077316924280450055694179944713142",
  nftCollateralContract: "0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d",
  loanERC20Denomination: "0x6b175474e89094c44da98b954eedeac495271d0f",
  lender: "0x9B7E6ac5D64b5bAd557d09d92c70a38F4bf1395a",
  borrower: "0x3f86f18322a888d9b3adef38f127c941bccc014d",
  interestIsProRated: false,
  signedMessage:
    "0x92c23bbd6338e03fc3d2e54a87783ef098f8c459c9290ba6d838f32b36ef1ba831a3348bc20cf6a210013064459fab8857533a545d43c9adf891f7b341c659fa1b",
};

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

async function makeOffer() {
  const response = await fetch("https://api.nftfi.com/offers", {
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization: "Bearer null",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua":
        '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
    },
    referrer: "https://nftfi.com/",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: '{"loanPrincipalAmount":"5000000000000000000","maximumRepaymentAmount":"5009589000000000000","nftCollateralId":"707","loanDuration":604800,"loanInterestRateForDurationInBasisPoints":"4294967295","adminFeeInBasisPoints":"500","lenderNonce":"77447815385563749389707693204129092952160649971788289514428829746067408853135","nftCollateralContract":"0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d","loanERC20Denomination":"0x6b175474e89094c44da98b954eedeac495271d0f","lender":"0x9B7E6ac5D64b5bAd557d09d92c70a38F4bf1395a","borrower":"0x3f86f18322a888d9b3adef38f127c941bccc014d","interestIsProRated":false,"signedMessage":"0x3cc19b392d52ce67ff8b34e4d709799eac2a619b9e4860284dc3b63a45f766ba3b6301338b4483b6346e821e5990075812cc80a3e8c5b7177ea129ecc118fb1a1c"}',
    method: "POST",
    mode: "cors",
  });

  console.log(response);
}

makeOffer();
