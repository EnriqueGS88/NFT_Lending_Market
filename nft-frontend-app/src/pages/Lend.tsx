import {useState, useEffect} from 'react';
import { AccountProps } from '../components/Tabs';
import colors from '../config/colors';
import { useTranslation } from "react-i18next";
import { Button, ToastMessage, Box, Flex, Field, Input, Text, Modal, Card, Heading } from 'rimble-ui';
import { Loans } from '../dtos/loans';
import Moralis from "moralis";

import { Protocol } from '../dtos/protocol';
import LoanItem from '../components/LoanItem';

export interface BorrowProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    loanContract: any,
    provider: any,
}

declare const window: any;
function Lend(props: AccountProps) {

    const [collateralBalance, setCollateralBalance] = useState(0);
    const [ethToBorrow, setEthToBorrow] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loans, setLoans] = useState<any[any]>([]);
    const [loansElement, setLoansELement] = useState<JSX.Element[]>();
    const [isLoading, setIsLoading] = useState(false);
    

    const translations = useTranslation("translations");
    
    useEffect(() => {
        setCollateralBalance(0);
        try {
            setIsLoading(true);
            getLoans();
        } catch {
            setIsLoading(false);
        }
    },[]);

    

    const getLoans = async () => {        
        const totalLoansRequests = (await props.loanContract.totalLoanRequests()).toString();

        const loansSC: Loans[] = [];
        for (let i = 0; i < totalLoansRequests; ++i) {
            const loansRequests = await props.loanContract.allLoanRequests(i);
            const loan: Loans = {
                loanID: loansRequests["loanID"],
                lender: loansRequests["lender"],
                borrower: loansRequests["borrower"],
                smartContractAddressOfNFT: loansRequests["smartContractAddressOfNFT"],
                tokenIdNFT: loansRequests["tokenIdNFT"],
                loanAmount: loansRequests["loanAmount"],
                interestAmount: loansRequests["interestAmount"],
                maximumPeriod: loansRequests["maximumPeriod"],
                endLoanTimeStamp: loansRequests["endLoanTimeStamp"],
            }
            loansSC.push(loan);
        }
        console.log("loans", loansSC)
        setIsLoading(false);
        const loansItems = [] as JSX.Element[];
        const loansAvailable = deleteLoansWithLenderAndMine(loansSC);
        loansAvailable.forEach((loanAvailable) => {
            loansItems.push(
                <LoanItem
                  key={loanAvailable.loanID.toString()}
                  loan={loanAvailable}
                />);
        });
        setLoansELement(loansItems);
        setLoans(loansAvailable);
    }
    function deleteLoansWithLenderAndMine(loans:  Loans[]){
        const loansAvailable: Loans[] = [];
        for (let i = 0; i < loans.length; ++i) {
            if(loans[i].lender === "0x0000000000000000000000000000000000000000" && loans[i].borrower !== props.account){
                loansAvailable.push(loans[i]);
            }
        }
        return loansAvailable;
    }


    function calculateAvailableToBorrow() {
        return collateralBalance;
    }


    return (
        <div>
            <h3>Lend ETH</h3>
            {props.account !== '' &&
                <div>
                    <div>
                    <p>List of Loans</p> 
                    <ul style={styles.list}>{loansElement}</ul>
                    <p>{translations.t("collateralBalance", { collateralBalance: collateralBalance }) }</p>
                    </div>
                    

                </div>
            }
            {props.account === '' &&
                <p>{translations.t("connectMetamask")}</p>
            }

        </div>
    )
  }

const styles = {
    box: {
        textAlign: 'center',
        backgroundColor: colors.bluePurple
    },
    list: {
        listStyleType:"none",
    },
}
export default Lend;