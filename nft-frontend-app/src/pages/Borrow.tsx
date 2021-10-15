import React, {useState, useEffect} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AccountProps } from '../components/Tabs';
import colors from '../config/colors';
import AddCollateral from './AddCollateral';
import Loans from './Loans';
import { useTranslation } from "react-i18next";

import Moralis from "moralis";

import { ethers, providers } from 'ethers';
import { Protocol } from '../dtos/protocol';
import RemoveCollateral from './RemoveCollateral';

export interface BorrowProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    loanContract: any,
    provider: any,
}

declare const window: any;
function Borrow(props: AccountProps) {

    const translations = useTranslation("translations");
    const [loans, setLoans] = useState<any[any]>([]);
    const [nfts, setNfts] = useState<any[any]>([]);
    const [queryLoans, setQueryLoans] = useState(true);
    const [queryNFTs, setQueryNFTs] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    

    const getLoans = async () => {        
        const totalLoansRequests = (await props.loanContract.totalLoanRequests()).toString();
        const loansSC:any = [];
        for (let i = 0; i < totalLoansRequests; ++i) {
            const loansRequests = await props.loanContract.allLoanRequests(i);
            loansSC.push(loansRequests);
        }
        console.log("loans", loansSC)
        setIsLoading(false);
        setLoans(loansSC);
    }

    async function getNFT() {
        try {
            const NFTs = await Moralis.Web3API.account.getNFTs({ chain: "rinkeby", address: props.account });
            console.log("NFTS", NFTs)
            
            setNfts(NFTs ? NFTs.result : []);
            setIsLoading(false);
        } catch (error) {
            console.log("error", error);
            setIsLoading(false);
        }
    }

    
    useEffect(() => {
        if (props.account && queryLoans) {
            try {
                setIsLoading(true);
                getLoans();
                setQueryLoans(false);
            } catch {
                setIsLoading(false);
            }
        }
    }, [props.account, queryLoans])

    useEffect(() => {
        if (props.account && queryNFTs) {
            setIsLoading(true);
            getNFT();
            setQueryNFTs(false);
        }
    }, [props.account, queryNFTs])

    if (props.loanContract) {
        props.loanContract.on("LoansUpdated", () => {
            console.log("is this doing something?")
            setQueryLoans(true);
            setQueryNFTs(true);
        })
    }
   

    return (
        <div>
            <h1>{translations.t("borrow")}</h1>
            <p>{translations.t("depositFirst")}</p>
            <p>{translations.t("afterDeposit")}</p>
            <Tabs indicatorColor={colors.bluePurple}>
                <TabList className={styles.tabs}>
                    <Tab>{translations.t("addCollateral")}</Tab>
                    <Tab>{translations.t("removeCollateral")}</Tab>
                    <Tab>{translations.t("loans")}</Tab>
                </TabList>
                <TabPanel>
                    <AddCollateral provider={props.provider} loanContract={props.loanContract} account={props.account} loans={loans} protocolVariables={props.protocolVariables} nfts={nfts} isLoading={isLoading}/>
                </TabPanel>
                <TabPanel>
                    <RemoveCollateral provider={props.provider} loanContract={props.loanContract} account={props.account} loans={loans} protocolVariables={props.protocolVariables} setQueryLoans={setQueryLoans} isLoading={isLoading}/>
                </TabPanel>
                <TabPanel>
                    <Loans provider={props.provider} loanContract={props.loanContract} account={props.account} loans={loans} protocolVariables={props.protocolVariables}/>
                </TabPanel>
            </Tabs>
        </div>
    )
  }

const styles = {
    tabs: {
        width: '50%',
        backgroundColor: colors.bluePurple
    },
}
export default Borrow;