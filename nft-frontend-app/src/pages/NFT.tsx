import React, {useState, useEffect} from 'react';

import Loader from 'react-loader-spinner';

import { Card, Button, Modal, ToastMessage, Flex, Box, Heading, Text} from 'rimble-ui';
import colors from '../config/colors';
import { useTranslation } from "react-i18next";
import { Protocol } from '../dtos/protocol';
import { ethers } from 'ethers';
import { confirmAlert } from 'react-confirm-alert';
    import "react-confirm-alert/src/react-confirm-alert.css";

export interface NFTProps {
    key: number,
    nft: any,
    protocolVariables: Protocol,
    getNFTprice: Function,
    realStateLastValue: number,
    nftWaitingForPrice: any,
    setNftWaitingForPrice: Function,
    ethUsdPrice: number,
    nftMintContract: any,
    loanContract: any,

}

function NFT(props: NFTProps) {

    const translations = useTranslation("translations");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [NFTmetadata, setNFTmetadata] = useState(JSON.parse(props.nft.metadata));
    const [loanAmountUSD, setLoanAmountUSD] = useState(0);
    const [loanAmountETH, setLoanAmountETH] = useState<any>(0);

    const [nftValueUSD, setNftValueUSD] = useState<any>(1000);
    const [isPriceUSD, setIsPriceUSD] = useState(true);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);
    const [contractTransferApproved, setContractTransferApproved] = useState("");
    const [transferApproved, setTransferApproved] = useState(true);
    const [isLoadingApproval, setIsLoadingApproval] = useState(false);
    const [isLoadingDeposit, setIsLoadingDeposit] = useState(false);


    useEffect(() => {
        if (isLoadingPrice && props.realStateLastValue > 0 && props.nftWaitingForPrice[0] === props.nft.token_id) {
            setNftValueUSD(props.realStateLastValue);
            localStorage.setItem(`value${props.nft.token_id}`, props.realStateLastValue.toString());
            const nftWaiting = props.nftWaitingForPrice.length > 1 ? props.nftWaitingForPrice.shift() : [];
            props.setNftWaitingForPrice(nftWaiting);
            localStorage.setItem("nftWaiting", JSON.stringify(nftWaiting))
            setIsLoadingPrice(true);
        }
        
    }, [props.realStateLastValue])

    useEffect(() => {
        const approved = async () => {
            if (props.nftMintContract) {
                try {
                    const res = await props.nftMintContract.getApproved(props.nft.token_id);
                    setContractTransferApproved(res);
                } catch (error) {
                    console.log(error);
                }
            }
        }

        if (transferApproved) {
            setTransferApproved(false);
            approved();
        }
        
    }, [transferApproved])

    function depositNFT(etherAmount: any, tokenId: number) {
        console.log("etheramount", etherAmount)
        if (etherAmount <= 0) return;

        const loanAmount = ethers.utils.parseEther(etherAmount.toString());
        const interes = ((props.protocolVariables.interestRate / 100) * etherAmount).toFixed(5);
        console.log("interes", interes)
        const interestAmount = ethers.utils.parseEther(interes);
        const maximumPeriod = props.protocolVariables.maximumPaybackMonths;
        // const smartContractNFTAddress = "0x3143623f5f13baf4a984ba221291afb0fd81d854";
        const smartContractNFTAddress = "0x8950851c462047285fe5502863C73799c5317B51";
        
        confirmAlert({
            title:  translations.t("nftLoan") ,
            message: translations.t("sureDoLoan", {etherAmount: etherAmount}),
            buttons: [
                {
                    label: "Yes",
                    onClick: async () => {
                        try {
                            await props.loanContract.createLoanRequest(smartContractNFTAddress, tokenId, loanAmount, interestAmount, maximumPeriod);
                        } catch (error) {
                            setIsLoadingDeposit(false);
                            console.log("error", error);
                        }
                    }
                },
                {
                    label: "No",
                    onClick: () => {}
                }
            ]
        });  
    }

    if (props.nftMintContract) {
        props.nftMintContract.on("Approval", (owner: any, approved: any, token: any) => {
            if (token.toString() === props.nft.token_id &&
            approved.toUpperCase() === "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98".toUpperCase()) {
                setTransferApproved(true);
                setIsLoadingApproval(false);
            }

        })
    }

    if (props.loanContract) {
        props.loanContract.on("LoansUpdated", (event: any) => {
            if (isLoadingDeposit) setIsLoadingDeposit(false);
        })
    }



    async function getPrice(){
        await props.getNFTprice(props.nft.token_id, props.nft.metadata);
        setIsLoadingPrice(true);
    }
    
    return (
        <div style={styles.listItem}>
            <Card border={1} borderColor={colors.bluePurple}>
                <div>
                    
                    <h4>{ translations.t("tokenID", {tokenId: props.nft.token_id})} </h4>
                    <h4>{translations.t("tokenName", { name: JSON.parse(props.nft.metadata).name })} </h4>
                    <img src={JSON.parse(props.nft.metadata).image}></img>
                    <p>{translations.t("description", { description: JSON.parse(props.nft.metadata).description})} </p>
                    <h6>{translations.t("tokenType", { type: props.nft.contract_type })}</h6>
                    <h6>{translations.t("blockMinted", { block: props.nft.block_number_minted })} </h6>
                </div>
                <div>
                    {nftValueUSD 
                        ? <>
                            
                            {contractTransferApproved.toUpperCase() === "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98".toUpperCase()
                                ? isPriceUSD ?
                                    <>
                                        <div>
                                <p>{translations.t("valueEquivalent", {valueUSD: nftValueUSD, valueETH: (nftValueUSD / props.ethUsdPrice).toFixed(4)})} </p>
                            </div>
                            <p> {translations.t("ask50")} </p>
                                    <label>USD </label> 
                                    <input
                                        type="number"
                                        min={0.01}
                                        step={0.01}
                                        onChange={(e:any) => {
                                            setLoanAmountUSD(e.target.value);
                                            setLoanAmountETH(Number((e.target.value/props.ethUsdPrice).toFixed(4)))
                                        }}
                                        value={loanAmountUSD}
                                        required={true}
                                    />
                                    <button onClick={() => { setIsPriceUSD(false) }}> Change </button>
                                    <label>ETH</label>
                                    <input
                                        type="number"
                                        disabled={true}
                                        placeholder={loanAmountETH.toString()}
                                    />
                                </>
                                : <>
                                    <label>ETH</label>
                                    <input
                                        type="number"
                                        onChange={(e:any) => {
                                            setLoanAmountETH(e.target.value);
                                            setLoanAmountUSD(Number((e.target.value*props.ethUsdPrice).toFixed(4)))
                                        }}
                                        value={loanAmountETH}
                                        required={true}
                                    />
                                    <button onClick={() => { setIsPriceUSD(true) }}> Change </button>
                                    <label>USD </label> 
                                    <input
                                        type="number"
                                        disabled={true}
                                        placeholder={loanAmountUSD.toString()}
                                    />
                                </>
                                : null}
                            
                             <br/>
                        <div style={styles.groupButtons}>
                        {contractTransferApproved.toUpperCase() === "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98".toUpperCase()
                            ?
                            !isLoadingDeposit ?
                                 <Button size={'medium'} onClick={() => {
                                    depositNFT(loanAmountETH , props.nft.token_id)
                                    setIsLoadingDeposit(true);
                                }}>{translations.t("deposit")} </Button>
                                : <Loader type="Oval" color="#000" height={70} width={70} />  
                            : !isLoadingApproval ?
                                <Button size={'medium'} onClick={async() => {
                                    await props.nftMintContract.approve("0x997853A0a4737Caaa3363804BbD2a1c290bf7F98",
                                        props.nft.token_id)
                                    setIsLoadingApproval(true);
                                }}>{translations.t("approveTransfer")}</Button>
                                : <Loader type="Oval" color="#000" height={70} width={70} />  
                        }
                        
                        </div>
                            
                        </>
                        : <>
                            {isLoadingPrice 
                                ? <Loader type="Oval" color="#000" height={70} width={70} />
                                : <Button onClick={async () => await getPrice()}>{translations.t("calcularNFTprice")}</Button>

                        }
                        
                        </>
                        }
                   
                </div>
            </Card>
        </div>  
    );
  }
  const styles = {
    listItem: {
      marginRight: '3%',
      marginBottom: '5%'
    },
    description: {
      width: "80%",
      marginLeft: '10%'
    },
    groupButtons: {
        display: 'inline-block',
        marginTop: 20
    },
    divider: {
        width: 100,
        height: 'auto',
        display: 'inline-block'
    }
  }
export default NFT;

    