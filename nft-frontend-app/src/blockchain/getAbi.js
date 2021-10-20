const fetch = require('node-fetch');

export async function getABI(ApiKeyToken, SmartContractAddress, network) {

    const url = network === "mainnet"
        ? `https://api.etherscan.io/api?module=contract&action=getabi&address=${SmartContractAddress}&apikey=${ApiKeyToken}`
        : `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${SmartContractAddress}&apikey=${ApiKeyToken}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.result;
}

