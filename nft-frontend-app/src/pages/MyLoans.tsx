/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";

import { ethers } from 'ethers';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import NFT from './NFT';
import { Protocol } from '../dtos/protocol';
import { Loans } from '../dtos/loans';
import LoanItemCancel from '../components/LoanItemCancel';

export interface MyLoanProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    loanContract: any,
    oracleChainLinkContract: any,
    provider: any,
    isLoading: boolean,
    ethBalance: number,
}

function MyLoans(props: MyLoanProps) {

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

    useEffect(() => {
        getValuePrice();
    }, [props.oracleChainLinkContract]);


    const getValuePrice = async () => {
        if (props.oracleChainLinkContract) {
            const price = ((await props.oracleChainLinkContract.latestAnswer()).toString() / Math.pow(10, 8));
            console.log("price", price);
            setEthUsdPrice(price);
        }   
    }




    
    const getLoans = async () => {        
        const totalLoansRequests = (await props.loanContract.totalLoanRequests()).toString();


        const loansSC: Loans[] = [];
        for (let i = 0; i < totalLoansRequests; ++i) {
            const loansRequests = await props.loanContract.allLoanRequests(i);
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
            console.log("----");
            console.log(loansSC);
            
        }
        setIsLoading(false);
        const loansItems = [] as JSX.Element[];
        const loansAvailable = deleteLoansWithoutLenderAndNotMine(loansSC);
        loansAvailable.forEach((loanAvailable) => {
            loansItems.push(
                <LoanItemCancel
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

    function deleteLoansWithoutLenderAndNotMine(loans:  Loans[]){
        const loansAvailable: Loans[] = [];
        for (let i = 0; i < loans.length; ++i) {
            if(loans[i].lender !== "0x0000000000000000000000000000000000000000" && loans[i].borrower === props.account){
                loansAvailable.push(loans[i]);
            }
        }
        return loansAvailable;
    }

    return (
        <div>
            <h3>{translations.t("myLoans")}</h3>
            {props.account !== '' &&
                <div>
                    <div>
                    <p>{translations.t("collateralBalance", { collateralBalance: props.ethBalance }) }</p>
                    <h4>{translations.t("listLoans")}</h4> 
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
    list: {
        listStyleType:"none",
        width: '60%',
        marginLeft: '20%',
    },
}
export default MyLoans;

