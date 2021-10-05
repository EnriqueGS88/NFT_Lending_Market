import { Button, ToastMessage } from 'rimble-ui';
import { AccountProps } from '../components/Tabs';

declare const window: any;  
function Collateral(props: AccountProps) {

    function depositNFT() {
        window.toastProvider.addMessage("Implementing...", {
            secondaryMessage: "This functionality will be available soon",
            colorTheme: "dark"
        })
    }

    return (
        <div>
            <h3>Deposit your Collateral</h3>
            {props.account !== '' &&
                <div>
                    <p>Hi {props.account} !</p>
                    <p>You don't have any NFT deposited</p>
                    <Button size={'medium'} onClick={()=> depositNFT()}>Deposit</Button>

                    <ToastMessage.Provider ref={(node: any) => (window.toastProvider = node)} />

                </div>
            }
            {props.account === '' &&
                <p>Connect with your Metamask Wallet</p>
            }

        </div>
    )
  }
export default Collateral;