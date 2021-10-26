/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AccountProps } from '../components/Tabs';
import colors from '../config/colors';
import AddCollateral from './AddCollateral';
import { useTranslation } from "react-i18next";

import Moralis from "moralis";
import { Protocol } from '../dtos/protocol';
import RemoveCollateral from './RemoveCollateral';
import MyLoans from './MyLoans';

export interface BorrowProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    loanContract: any,
    nftMintContract:any,
    realStateValueContract: any,
    oracleChainLinkContract: any,
    provider: any,
    ethBalance: number,
}

function Borrow(props: AccountProps) {

    const translations = useTranslation("translations");
    const [loans, setLoans] = useState<any[any]>([]);
    const [nfts, setNfts] = useState<any[any]>([]);
    const [queryLoans, setQueryLoans] = useState(true);
    const [queryNFTs, setQueryNFTs] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCancel, setIsLoadingCancel] = useState(false);

    

    const getLoans = async () => {       
        const totalLoansRequests = await props.loanContract.totalLoanRequests();
        if(totalLoansRequests){
            const loansSC:any = [];
            for (let i = 0; i < totalLoansRequests; ++i) {
                const loansRequests = await props.loanContract.allLoanRequests(i);
                loansSC.push(loansRequests);
            }
            // console.log("loans", loansSC)
            setIsLoading(false);
            setLoans(loansSC);
        }
    }

    async function getNFT() {
        try {
            const NFTs = await Moralis.Web3API.account.getNFTs({ chain: "rinkeby", address: props.account });
            console.log("NFTS", NFTs)
            
            setNfts(NFTs ? NFTs.result?.filter(nft => {
                return (nft.token_address.toUpperCase() === "0x8950851c462047285fe5502863C73799c5317B51".toUpperCase()
                    && nft.metadata)
            }) : []);
            setIsLoading(false);
        } catch (error) {
            console.log("error", error);
            setIsLoading(false);
        }
    }

    
    useEffect(() => {
        async function fetchLoans(){
            if (props.account && queryLoans) {
                try {
                    setIsLoading(true);
                    await getLoans();
                    setQueryLoans(false);
                } catch {
                    setIsLoading(false);
                }
            }
        }
        fetchLoans();
    }, [props.account, queryLoans])

    useEffect(() => {
        if (props.account && queryNFTs) {
            setIsLoading(true);
            getNFT();
            setQueryNFTs(false);
        }
    }, [props.account, queryNFTs])

    if (props.loanContract) {
        props.loanContract.on("LoansUpdated", (event: any) => {
            console.log("is this doing something?", event)
            setQueryLoans(true);
            setQueryNFTs(true);
        })
    }
   

    return (
        <div>
            <h1>{translations.t("borrow")}</h1>
            <p>{translations.t("depositFirst")}</p>
            <p>{translations.t("afterDeposit")}</p>
            <Tabs indicatorcolor={colors.bluePurple}>
                <TabList className={styles.tabs}>
                    <Tab>{translations.t("addCollateral")}</Tab>
                    <Tab>{translations.t("removeCollateral")}</Tab>
                    <Tab>My Loans</Tab>
                </TabList>
                <TabPanel>
                    <AddCollateral  provider={props.provider} nftMintContract={props.nftMintContract} loanContract={props.loanContract} account={props.account} loans={loans} protocolVariables={props.protocolVariables} nfts={nfts} isLoading={isLoading} realStateValueContract={props.realStateValueContract} oracleChainLinkContract={props.oracleChainLinkContract}/>
                </TabPanel>
                <TabPanel>
                    <RemoveCollateral provider={props.provider} loanContract={props.loanContract}  account={props.account} loans={loans} protocolVariables={props.protocolVariables} setQueryLoans={setQueryLoans} isLoading={isLoading}/>
                </TabPanel>
                <TabPanel>
                    <MyLoans provider={props.provider} loanContract={props.loanContract} account={props.account} loans={loans} protocolVariables={props.protocolVariables} isLoading={isLoading} ethBalance={props.ethBalance} oracleChainLinkContract={props.oracleChainLinkContract}/>
                </TabPanel>
            </Tabs>
        </div>
    )
  }

const styles = {
    tabs: {
        width: '50%',
        backgroundColor: colors.bluePurple,
    },
}
export default Borrow;