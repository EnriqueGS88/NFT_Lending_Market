import { Button, ToastMessage } from 'rimble-ui';
import { AccountProps } from '../components/Tabs';
import { useTranslation } from "react-i18next";

declare const window: any;  
function Collateral(props: AccountProps) {

    const translations = useTranslation("translations");

    
    function depositNFT() {
        window.toastProvider.addMessage("Implementing...", {
            secondaryMessage: "This functionality will be available soon",
            colorTheme: "dark"
        })
    }

    return (
        <div>
            <h3>{translations.t("depositCollateral")}</h3>
            {props.account !== '' &&
                <div>
                    <p>Hi {props.account} !</p>
                    <p>{translations.t("noNFT")}</p>
                    <Button size={'medium'} onClick={()=> depositNFT()}>{translations.t("deposit")}</Button>

                    <ToastMessage.Provider ref={(node: any) => (window.toastProvider = node)} />

                </div>
            }
            {props.account === '' &&
                <p>{translations.t("connectMetamask")}</p>
            }

        </div>
    )
  }
export default Collateral;