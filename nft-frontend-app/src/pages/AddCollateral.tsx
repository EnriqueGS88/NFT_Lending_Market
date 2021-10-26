/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";

import { ethers } from 'ethers';

import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

import NFT from './NFT';
import { Protocol } from '../dtos/protocol';

export interface AddCollateralProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    loanContract: any,
    realStateValueContract: any,
    oracleChainLinkContract: any,
    nftMintContract:any
    provider: any,
    nfts: Array<any>,
    isLoading: boolean,
}

function AddCollateral(props: AddCollateralProps) {

    const translations = useTranslation("translations");
    
    const [nftWaitingForPrice, setNftWaitingForPrice] = useState<any[any]>(localStorage.getItem("nftWaitingPrice") ? JSON.parse(localStorage.getItem("nftWaitingPrice")!) : []);
    const [realStateLastValue, setRealStateLastValue] = useState(0);
    const [ethUsdPrice, setEthUsdPrice] = useState(0);


    const [userNFTs, setUserNFTs] = useState<any[any]>([]);

    useEffect(() => {
        console.log("nfts", props.nfts);
        const nfts = props.nfts.filter(nft => {
            return !props.loans.find(loan => loan.tokenIdNFT === Number(nft.token_id) && loan.status === 0)
        })
        setUserNFTs(nfts);
    }, [props.nfts, props.loans])


    useEffect(() => {
        getValuePrice();
    }, [props.oracleChainLinkContract]);



        
    async function getNFTprice(tokenId: number, nftMetadata: any) {
        
        const infoToken = {
            city: "barcelona",
            cp: "08080",
            country: "es",
            size: "120",
            condition: "good",
        }   

        try {
            await props.realStateValueContract.requestRealStateValue(
                infoToken.city, infoToken.cp, infoToken.country, infoToken.size, infoToken.condition
            )
            
            const nftWaiting = [...nftWaitingForPrice, tokenId];
            localStorage.setItem("nftWaitingPrice", JSON.stringify(nftWaiting));
            setNftWaitingForPrice(nftWaiting);

        } catch (error) {
            console.log("error", error);
        }
    }

    if (props.realStateValueContract) {
        props.realStateValueContract.on("ValueUpdated", (price: any) => {
            setRealStateLastValue(Number(price.toString()));
        })
    }
   
    const getValuePrice = async () => {
        if (props.oracleChainLinkContract) {
            const price = ((await props.oracleChainLinkContract
                .latestAnswer()).toString() / Math.pow(10, 8));
            setEthUsdPrice(price);
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
                            <NFT nftMintContract={props.nftMintContract} key={nft.token_id} nft={nft} protocolVariables={props.protocolVariables} getNFTprice={getNFTprice} setNftWaitingForPrice={setNftWaitingForPrice} realStateLastValue={realStateLastValue} nftWaitingForPrice={nftWaitingForPrice} loanContract={props.loanContract} ethUsdPrice={ethUsdPrice}/>
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

