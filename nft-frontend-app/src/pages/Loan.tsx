import { Button } from 'rimble-ui';
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Protocol } from '../dtos/protocol';
import Loader from 'react-loader-spinner';

export interface LoanProps {
    key: number,
    loan: any,
    protocolVariables: Protocol,
    loanContract: any,


}

function Loan(props: LoanProps) {

    const translations = useTranslation("translations");
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);


    async function cancelDeposit(loanID: number) {
       
        try {
            await props.loanContract.cancelLoanRequest(loanID);
        } catch (error) {
            setIsLoadingCancel(false);
            console.log("error", error);
        }
    }

    if (props.loanContract) {
        props.loanContract.on("LoansUpdated", (event: any) => {
            if (isLoadingCancel) setIsLoadingCancel(false);
        })
    }

    return (
        <>
            <div className="nft" style={{border: "3px solid black", margin: "10px"}}>
                <div>
                    <h3>{ translations.t("loanID", {loanId: props.loan.loanID.toString()})} </h3>
                    <h3>{translations.t("tokenID", {tokenId: props.loan.tokenIdNFT})}  </h3>
                </div>
                <div>
                    {
                        !isLoadingCancel ?
                            <Button onClick={async () => {
                                setIsLoadingCancel(true);
                                await cancelDeposit(props.loan.loanID.toString())
                            }}>{translations.t("cancelCollateral")}</Button>
                            : <Loader type="Oval" color="#000" height={70} width={70} /> 
                    }
                </div>
            </div>
        </>
    );
  }

export default Loan;