import React, {useEffect, useState }  from 'react';
import { ethers } from 'ethers';
import { Button, ToastMessage } from 'rimble-ui';

declare const window: any;
function Collateral() {
    const [myAddress, setMyAddress] = useState('');

    useEffect(() => {
        const getMyAccount = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setMyAddress(address);
        }
        getMyAccount();
    },[]);

    function depositNFT() {
        window.toastProvider.addMessage("Implementing...", {
            secondaryMessage: "This functionality will be available soon",
            colorTheme: "dark"
        })
    }

    return (
        <div>
            <h3>Deposit your Collateral</h3>
            {myAddress !== '' &&
                <div>
                    <p>Hi {myAddress} !</p>
                    <p>You don't have any NFT deposited</p>
                    <Button size={'medium'} onClick={()=> depositNFT()}>Deposit</Button>

                    <ToastMessage.Provider ref={(node: any) => (window.toastProvider = node)} />

                </div>
            }
            {myAddress === '' &&
                <p>Connect with your Metamask Wallet</p>
            }

        </div>
    )
  }
export default Collateral;