import React, {useState, useEffect} from 'react';
import { Button } from 'rimble-ui';

import { useTranslation } from "react-i18next";

import { Protocol } from '../dtos/protocol';

export interface LoanProps {
    key: number,
    loan: any,
    protocolVariables: Protocol,
    cancelDeposit: Function,
}

declare const window: any;
function Loan(props: LoanProps) {

    const translations = useTranslation("translations");
    
    return (
        <>
            <div className="nft" style={{border: "3px solid black", margin: "10px"}}>
                <div>
                    <h3>Loan ID: {props.loan.loanID.toString()} </h3>
                    <h3>Token ID: {props.loan.tokenIdNFT} </h3>
                </div>
                <form onSubmit={async (event) => {
                    event.preventDefault();
                    await props.cancelDeposit(props.loan.loanID.toString())}
                } >
                    <Button type="submit">{translations.t("cancelCollateral")}</Button>
                </form>
                <div>
                </div>
            </div>
        </>
    );
  }

export default Loan;