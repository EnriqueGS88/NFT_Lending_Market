/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastMessage } from 'rimble-ui';
import Header from './components/Header';
import HeaderTabs from './components/Tabs';
import Footer from './components/Footer';

import { getABI } from './blockchain/getAbi';
import { Protocol } from './dtos/protocol';


// Update with the contract address logged out to the CLI when it was deployed 
const loadNFTAddress = "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98";
const createNFT = "0x0bEE0f0dBa0890E9A510AaD08D023A691fA69eA3";
declare const window: any;

function App() {
  const [isConnectionSuccess, setConnectionSuccess] = useState(false);
  const [isConnectionFailed, setConnectionFailed] = useState(false);
  const [myAddress, setMyAddress] = useState('');
  const [ethBalance, setEthBalance] = useState(0);
  const [loanContract, setLoanContract] = useState<any>();
  const [realStateValueContract, setRealStateValueContract] = useState<any>();
  const [oracleChainLinkContract, setOracleChainLinkContract] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mintNFTContract, setMintNFTContract] = useState<any>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [provider, setProvider] = useState(new ethers.providers.Web3Provider(window.ethereum, "rinkeby"));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [protocolVariables, setProtocolVariables] = useState<Protocol>(
    {
      interestRate: 1,
      minimumPaybackMonths: 1,
      maximumPaybackMonths: 11,
      conditionsReviewPeriod: 'monthly',
      votePeriod: 5,
    }
  );

  useEffect(() => {
    getLoanContract();
    getMintNFTContract();
    getRealStateValueContract();
    getOracleChainLinkPriceContract();
  }, [])

  const getLoanContract = async () => {
    try {
      if (provider) {
        const SmartContractAddress = "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98";
        const ApiTokenEtherscan = "73T2GI2P7GWCFGFGIAJ1VSJCUXG2TDDXES";
        const contractAbi = await getABI(ApiTokenEtherscan, SmartContractAddress);
        const ABI = JSON.parse(contractAbi);
        const signer = provider.getSigner();
      
        setLoanContract(new ethers.Contract(SmartContractAddress, ABI, signer))
      }
      

    } catch (error) {
      console.log("error", error)
    }
  }

  const getMintNFTContract = async () => {
    try {
      if (provider) {
        const SmartContractAddress = "0x3143623f5f13baf4a984ba221291afb0fd81d854";
        const ApiTokenEtherscan = "73T2GI2P7GWCFGFGIAJ1VSJCUXG2TDDXES";
        const contractAbi = await getABI(ApiTokenEtherscan, SmartContractAddress);
        const ABI = JSON.parse(contractAbi);
        const signer = provider.getSigner();
      
        setMintNFTContract(new ethers.Contract(SmartContractAddress, ABI, signer))
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const getOracleChainLinkPriceContract = async () => {
    try {
      const ApiKeyInfura = "3d3bf2148fb84332a81b6d7cab711de9";
      const provider = new ethers.providers.InfuraProvider("homestead", ApiKeyInfura);
      console.log("provider", provider)
      const ApiTokenEtherscan = "73T2GI2P7GWCFGFGIAJ1VSJCUXG2TDDXES";
      const smartContractChainlinkAddress = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
      const contractAbi = await getABI(ApiTokenEtherscan, smartContractChainlinkAddress, "mainnet");
      console.log("contractABi", contractAbi)
      const ABI = JSON.parse(contractAbi);

      setOracleChainLinkContract(new ethers.Contract(smartContractChainlinkAddress, ABI, provider));
      
    } catch (error) {
      console.log("error ChainLink", error);
    }
  }

  

  const getRealStateValueContract = async () => {
    try {
      if (provider) {
        const ApiTokenEtherscan = "73T2GI2P7GWCFGFGIAJ1VSJCUXG2TDDXES";
        const smartContractChainlinkAddress = "0xFe6BB3f0376b610888EAEFFfD94c00E28246e315";
        const contractAbi = await getABI(ApiTokenEtherscan, smartContractChainlinkAddress);
        const ABI = JSON.parse(contractAbi);
        const signer = provider.getSigner();

        setRealStateValueContract(new ethers.Contract(smartContractChainlinkAddress, ABI, signer));
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  const getMyAccount = async () => {
    try {
      if (provider) {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const balanceInfo = await provider.getBalance(address);
        const balanceEth = Number(ethers.BigNumber.from(balanceInfo).toString()) / Math.pow(10, 18);
        console.log("address", address)
        setMyAddress(address);
        setEthBalance(balanceEth);
        setConnectionSuccess(true);
      }
      
    } catch {
      setConnectionSuccess(false);
    }
  }

  const getBalanceToken = async () => {
    
    const SmartContractAddress = "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98";
    const ApiTokenEtherscan = "73T2GI2P7GWCFGFGIAJ1VSJCUXG2TDDXES";
    const contractAbi = await getABI(ApiTokenEtherscan, SmartContractAddress);
    const ABI = JSON.parse(contractAbi);
   
    try {
      if (provider) {
          const contract = new ethers.Contract(SmartContractAddress, ABI, provider);
          const balance = (await contract.balanceOf(myAddress)).toString();
          console.log("balance", balance);
      }  
    } catch {}
  }

  useEffect(() => {
    getBalanceToken();
  }, [])

  useEffect(() => {
    getMyAccount();
  }, [isConnectionSuccess])

  return (
    <div style={{textAlign: 'center'}}>
      {isConnectionSuccess &&
        <ToastMessage.Success
          my={3}
          message={"Connection successfully"}
          secondaryMessage={"Connected with your Metamask Account"}
          closeElem={true}
          onClick={()=>setConnectionSuccess(false)}
        />
      }
      {isConnectionFailed &&
        <ToastMessage.Failure
          my={3}
          message={"Connection failed"}
          secondaryMessage={"Something wrong with your connection"}
          closeElem={true}
        />
      }

      <Header account={myAddress} setConnectionSuccess={setConnectionSuccess} setConnectionFailed={setConnectionFailed}></Header>
      <HeaderTabs account={myAddress} ethBalance={ethBalance} getAccount={getMyAccount} protocolVariables={protocolVariables} loanContract={loanContract} provider={provider} realStateValueContract={realStateValueContract} oracleChainLinkContract={oracleChainLinkContract}/>
      <Footer/>
    </div>
  );
}


export default App;