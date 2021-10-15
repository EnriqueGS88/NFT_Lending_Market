import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ToastMessage } from 'rimble-ui';
import Header from './components/Header';
import HeaderTabs from './components/Tabs';
import Footer from './components/Footer';

import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import { Web3Provider } from '@ethersproject/providers';

// Update with the contract address logged out to the CLI when it was deployed 
const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
//TODO: store addresses SC project
const loadNFTAddress = "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98";
const createNFT = "0x0bEE0f0dBa0890E9A510AaD08D023A691fA69eA3";
declare const window: any;

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState()
  const [isConnectionSuccess, setConnectionSuccess] = useState(window.ethereum ? true : false);
  const [isConnectionFailed, setConnectionFailed] = useState(false);
  const [myAddress, setMyAddress] = useState('');
  const [ethBalance, setEthBalance] = useState(0);


  const getMyAccount = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balanceInfo = await provider.getBalance(address);
    const balanceEth = Number(ethers.BigNumber.from(balanceInfo).toString()) / Math.pow(10, 18);
    setMyAddress(address);
    setEthBalance(balanceEth);
  }

  useEffect(() => {
    if (isConnectionSuccess) {
      getMyAccount();
    }
    
  }, [isConnectionSuccess])

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // async function getBalance() {
  //     if (typeof window.ethereum !== 'undefined') {
  //         const provider = new ethers.providers.Web3Provider(window.ethereum, "rinkeby");
  //         const signer = provider.getSigner();
  //         const address = await signer.getAddress();
  //         const balanceInfo = await provider.getBalance(address);
  //         const balanceEth = Number(ethers.BigNumber.from(balanceInfo).toString()) / Math.pow(10, 18);
  //     }
  // }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }


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

      {console.log("HOLI", myAddress)}
      <Header setConnectionSuccess={setConnectionSuccess} setConnectionFailed={setConnectionFailed}></Header>
      <HeaderTabs account={myAddress} ethBalance={ethBalance} getAccount={getMyAccount} />
      <Footer/>
      
    </div>
  );
}


export default App;