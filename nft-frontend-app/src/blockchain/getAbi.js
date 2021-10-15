const fetch = require('node-fetch');

export async function getABI(ApiKeyToken, SmartContractAddress) {
    const url = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${SmartContractAddress}&apikey=${ApiKeyToken}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.result;
}

