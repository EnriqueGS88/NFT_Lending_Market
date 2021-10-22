import React, {useEffect, useState }  from 'react';
import {House} from '../dtos/houses';
import HouseItem from '../components/HouseItem';

import realStateData from '../data/real-state.json';
import { AccountProps } from '../components/Tabs';

import { useTranslation } from "react-i18next";
import { Protocol } from '../dtos/protocol';
import { Loans } from '../dtos/loans';
import LoanItemCancel from '../components/LoanItemCancel';
import LoanItemLiquidate from '../components/LoanItemLiquidate';

export interface LiquidateProps {
    account: string,
    protocolVariables: Protocol,
    loanContract: any,
    provider: any,
    ethBalance: number,
}
function Liquidate(props: LiquidateProps) {


    const [collateralBalance, setCollateralBalance] = useState(props.ethBalance);
    const [ethToBorrow, setEthToBorrow] = useState(0);
    const [isModalOpen, setModalOpen] = useState(false);
    const [loans, setLoans] = useState<any[any]>([]);
    const [loansElement, setLoansELement] = useState<JSX.Element[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [ethUsdPrice, setEthUsdPrice] = useState(0);
    const [queryLoans, setQueryLoans] = useState(true);


    

    const translations = useTranslation("translations");
    
    useEffect(() => {
        if (queryLoans) {
            setQueryLoans(false);
            try {
            setIsLoading(true);
            getLoans();
            } catch {
                setIsLoading(false);
            }
        }
        
    },[ethUsdPrice, queryLoans]);

 
    
    const getLoans = async () => {        
        const totalLoansRequests = (await props.loanContract.totalLoanRequests()).toString();

        const loansSC: Loans[] = [];
        for (let i = 0; i < totalLoansRequests; ++i) {
            const loansRequests = await props.loanContract.allLoanRequests(i);
            console.log(loansRequests);
            if (loansRequests.status === 1) {
                const loan: Loans = {
                loanID: loansRequests["loanID"],
                nftPrice: Number(localStorage.getItem(`value${loansRequests["tokenIdNFT"]}`)!),
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
            
        }
        setIsLoading(false);
        const loansItems = [] as JSX.Element[];
        const loansAvailable = deleteLoansIAmNotLender(loansSC);
        loansAvailable.forEach((loanAvailable) => {
            loansItems.push(
                <LoanItemLiquidate
                    key={loanAvailable.loanID.toString()}
                    loan={loanAvailable}
                    loanContract={props.loanContract}
                    ethUsdPrice={ethUsdPrice}
                    protocolVariables={props.protocolVariables}
                />);
        });
        setLoansELement(loansItems);
        setLoans(loansAvailable);
    }

    function deleteLoansIAmNotLender(loans:  Loans[]){
        const loansAvailable: Loans[] = [];
        for (let i = 0; i < loans.length; ++i) {
            if(loans[i].lender === props.account){
                loansAvailable.push(loans[i]);
            }
        }
        return loansAvailable;
    }

    return (
        <div>
            <h3>{translations.t("borrow")}</h3>
            {props.account !== '' &&
                <div>
                <h6>{translations.t("collateralBalance", { collateralBalance: props.ethBalance })} </h6>


                    <p>{translations.t("listHouses")}</p> 
                    <ul style={styles.list}>{loansElement}</ul>
                </div>
            }
            {props.account === '' &&
                <p>{translations.t("connectMetamask")}</p>
            }

        </div>
    )
  }

const styles = {
    input: {
        width: '50%',
        marginLeft: '25%'
    },
    list: {
        listStyleType:"none",
    },
}
export default Liquidate;