import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { BorrowProps } from './Borrow';
import Loader from "react-loader-spinner";


import { ethers } from 'ethers';
import { getABI } from "../blockchain/getAbi";
import { Protocol } from '../dtos/protocol';
import Loan from './Loan';

export interface LoansProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    setQueryLoans: Function,
    isLoading: boolean,
    provider: any,
    loanContract: any
}


declare const window: any;  
function RemoveCollateral(props: LoansProps) {

    const translations = useTranslation("translations");
    const [loansPending, setLoansPending] = useState<any[any]>([])
    const [loansCanceledPendingConfirmation, setLoansCanceledPendingConfirmation] = useState<any[any]>([]);

    useEffect(() => {
        const loansToBeCancelled:any = [];
        for (let i = 0; i < loansCanceledPendingConfirmation.length; ++i) {
            if (props.loans.find(loan => loan.loanID.toString() === loansCanceledPendingConfirmation[i])) {
                loansToBeCancelled.push(loansCanceledPendingConfirmation[i]);
            }
        }
        setLoansCanceledPendingConfirmation(loansToBeCancelled);

        const loansFiltered = props.loans.length > 0 ? props.loans.filter(loan => {
            return loan.status === 0 && loan.borrower === props.account && !loansToBeCancelled.includes(loan.loanID.toString());
        }) : [];
        setLoansPending(loansFiltered);

    }, [props.account, props.loans])
    

    
    async function cancelDeposit(loanID: number) {
       
        try {
            await props.loanContract.cancelLoanRequest(loanID);
            setLoansCanceledPendingConfirmation(loansCanceledPendingConfirmation.push(loanID));
            const newListLoans = loansPending.filter((loan: { loanID: { toString: () => number; }; }) => loan.loanID.toString() !== loanID);
            setLoansPending(newListLoans);
        } catch (error) {
            console.log("error", error);
        }
    }
    

    return (
        <div>
            {console.log("loans", loansPending)}
            <h3>{translations.t("removeCollateral")}</h3>
            {props.account !== '' &&
                <div>
                {props.isLoading
                    ?  <Loader type="Oval" color="#000" height={70} width={70} />
                    : loansPending.length === 0
                        ? <p>{translations.t("noLendsPending")}</p>
                        : loansPending.map((loan:any) => (
                            <Loan key={loan.loanID.toString()} loan={loan} protocolVariables={props.protocolVariables} cancelDeposit={cancelDeposit} />
                        ))
                }
                </div>
            }
            {props.account === '' &&
                <p>{translations.t("connectMetamask")}</p>
            }

        </div>
    )
  }
export default RemoveCollateral;