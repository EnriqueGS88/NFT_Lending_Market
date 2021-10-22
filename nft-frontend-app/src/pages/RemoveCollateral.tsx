import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
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
 
function RemoveCollateral(props: LoansProps) {

    const translations = useTranslation("translations");
    const [loansPending, setLoansPending] = useState<any[any]>([]);




    useEffect(() => {
        const loansFiltered = props.loans.length > 0 ? props.loans.filter(loan => {
            return loan.status === 0 && loan.borrower === props.account;
        }) : [];
        setLoansPending(loansFiltered);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.account, props.loans])
    

    

    return (
        <div>
            <h3>{translations.t("removeCollateral")}</h3>
            {props.account !== '' &&
                <div>
                {props.isLoading
                    ?  <Loader type="Oval" color="#000" height={70} width={70} />
                    : loansPending.length === 0
                        ? <p>{translations.t("noLendsPending")}</p>
                        : loansPending.map((loan:any) => (
                            <Loan key={loan.loanID.toString()} loan={loan} loanContract={props.loanContract} protocolVariables={props.protocolVariables} />
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