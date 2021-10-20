import {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import { AccountProps } from '../components/Tabs';
import colors from '../config/colors';
import { useTranslation } from "react-i18next";
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

    const [balance, setBalance] = useState(0);
    const [ethToBorrow, setEthToBorrow] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loans, setLoans] = useState<any[any]>([]);
    const [loansElement, setLoansELement] = useState<JSX.Element[]>();
    const [isLoading, setIsLoading] = useState(false);
    

    const translations = useTranslation("translations");
    
    useEffect(() => {
        async function getBalance() {
            const balanceInfo = await props.provider.getBalance(props.account);
            const balanceEth = Number(ethers.BigNumber.from(balanceInfo).toString()) / Math.pow(10, 18);
            setBalance(balanceEth);
        }
        
        try {
            setIsLoading(true);
            getLoans();
        } catch {
            setIsLoading(false);
        }
        getBalance();
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
                  loanContract={props.loanContract}
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


    return (
        <div>
            <h3>Lend ETH</h3>
            {props.account !== '' &&
                <div>
                    <div>
                    <p>{translations.t("collateralBalance", { collateralBalance: balance }) }</p>
                    <h4>List of Loans</h4> 
                    <ul style={styles.list}>{loansElement}</ul>
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
        width: '33%',
        marginLeft: '33%',
    },
}
export default Lend;