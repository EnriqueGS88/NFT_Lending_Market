/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";

import { ethers } from 'ethers';
import { getABI } from "../blockchain/getAbi";


import NFT from './NFT';
import { Protocol } from '../dtos/protocol';

export interface AddCollateralProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    loanContract: any,
    realStateValueContract: any,
    oracleChainLinkContract: any,
    provider: any,
    nfts: Array<any>,
    isLoading: boolean,
}

function AddCollateral(props: AddCollateralProps) {

    const [isLoadingPrice, setIsLoadingPrice] = useState(false);
    const [realStateValueUsdPrice, setRealStateValuePrice] = useState(0);
    const translations = useTranslation("translations");
    const [depositsPendingConfirmation, setDepositsPendingConfirmation] = useState<any[number]>(() => {
         const pending = localStorage.getItem("depositsPendingConfirmation");
        if (pending) {
            return JSON.parse(pending) 
        } else {
            return [];
        }
    });

    const [userNFTs, setUserNFTs] = useState<any[any]>([]);

    useEffect(() => {
        const nfts = props.nfts.filter(nft => {
            console.log("depositsPending", depositsPendingConfirmation);
            console.log("nft", nft.token_id);
            return !props.loans.find(loan => loan.tokenIdNFT === Number(nft.token_id)) && !depositsPendingConfirmation.includes(nft.token_id)
        })
        setUserNFTs(nfts);  
    }, [props.nfts, depositsPendingConfirmation])

    useEffect(() => {
        const depositsStillPending = [];
        for (let i = 0; i < depositsPendingConfirmation.length; ++i) {
            if (!props.loans.find(loan => loan.tokenIdNFT === depositsPendingConfirmation[i])) {
                depositsStillPending.push(depositsPendingConfirmation[i]);
            }
        }
        localStorage.setItem("depositsPendingConfirmation", JSON.stringify(depositsStillPending));
        setDepositsPendingConfirmation(depositsStillPending);
    }, [props.loans])

    useEffect(() => {
        async function getPricesChainLink(){
            console.log("HOLa", props.oracleChainLinkContract);
            await getValuePrice();
        }
        getPricesChainLink();
    }, [props.oracleChainLinkContract])

    
    async function depositNFT(etherAmount: number, tokenId: number) {
        if (etherAmount <= 0) return;

        const loanAmount = ethers.utils.parseEther(etherAmount.toString());
        const interestAmount = ethers.utils.parseEther(((props.protocolVariables.interestRate / 100) * etherAmount).toString());
        const maximumPeriod = props.protocolVariables.maximumPaybackMonths;
        const smartContractNFTAddress = "0x3143623f5f13baf4a984ba221291afb0fd81d854";

        try {
            await props.loanContract.createLoanRequest(smartContractNFTAddress, tokenId, loanAmount, interestAmount, maximumPeriod);
            const depositsUpdated = depositsPendingConfirmation.length > 0 ? depositsPendingConfirmation.push(tokenId) : [tokenId];
            localStorage.setItem("depositsPendingConfirmation", JSON.stringify(depositsUpdated));
            setDepositsPendingConfirmation(depositsUpdated);
        } catch (error) {
            console.log("error", error);
        }
    }

        
    async function getNFTprice(nftMetadata: any) {
        
        const infoToken = {
            city: "barcelona",
            cp: "08080",
            country: "es",
            size: "120",
            condition: "good",
        }   

        try {
            await props.realStateValueContract.requestRealStateValue(infoToken.city, infoToken.cp, infoToken.country, infoToken.size, infoToken.condition)
            setIsLoadingPrice(true);
        } catch (error) {
            console.log("error", error);
        }
    }

    if (props.realStateValueContract) {
        props.realStateValueContract.on("LoansUpdated", (event:any) => {
            console.log("value", event)
        })
    }
   
    const getValuePrice = async () => {
        const res = await props.oracleChainLinkContract.latestAnswer();
        if(res){
            return res.toString() / Math.pow(10, 8);
        }
        
    }

    return (
        <div>
            <h3>{translations.t("depositCollateral")}</h3>
            {props.account !== '' &&
                <div style={styles.list}>
                {props.isLoading
                    ?  <Loader type="Oval" color="#000" height={70} width={70} />
                    : userNFTs.length === 0
                        ? <p>{translations.t("noNFT")}</p>
                        : userNFTs.map((nft:any) => (
                            <NFT key={nft.token_id} nft={nft} protocolVariables={props.protocolVariables} depositNFT={depositNFT} getNFTprice={getNFTprice} />
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

  const styles = {
    list: {
        listStyleType:"none",
        width: '60%',
        marginLeft: '20%',
    },
}
export default AddCollateral;