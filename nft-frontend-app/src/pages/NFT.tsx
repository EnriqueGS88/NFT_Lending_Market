import React, {useState, useEffect} from 'react';

import Loader from 'react-loader-spinner';

import { Card, Button, Modal, ToastMessage, Flex, Box, Heading, Text} from 'rimble-ui';
import colors from '../config/colors';
import { useTranslation } from "react-i18next";
import { Protocol } from '../dtos/protocol';
import { NFTObject } from '../dtos/nft';

export interface NFTProps {
    key: number,
    nft: any,
    protocolVariables: Protocol,
    depositNFT: Function,
    getNFTprice: Function,
    realStateLastValue: number,
    nftWaitingForPrice: any,
    setNftWaitingForPrice: Function,
    ethUsdPrice: number,
    nftMintContract:any,
}

function NFT(props: NFTProps) {

    const translations = useTranslation("translations");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [NFTmetadata, setNFTmetadata] = useState(JSON.parse(props.nft.metadata));
    const [loanAmountUSD, setLoanAmountUSD] = useState(0);
    const [loanAmountETH, setLoanAmountETH] = useState<any>(0);

    const [nftValueUSD, setNftValueUSD] = useState<any>(localStorage.getItem(`value${props.nft.token_id}`));
    const [isPriceUSD, setIsPriceUSD] = useState(true);
    const [isLoadingPrice, setIsLoadingPrice] = useState(false);
    const [contractTransferApproved, setContractTransferApproved] = useState("");
    const [transferApproved, setTransferApproved] = useState(true);
    const [isLoadingApproval, setIsLoadingApproval] = useState(false);

    useEffect(() => {
        if (isLoadingPrice && props.realStateLastValue > 0 && props.nftWaitingForPrice[0] === props.nft.token_id) {
            console.log("tokenId", props.nft.token_id);
            console.log("props", props.nftWaitingForPrice)
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
            const res = await props.nftMintContract.getApproved(props.nft.token_id);
            setContractTransferApproved(res);
        }

        if (transferApproved) {
            setTransferApproved(false);
            approved();
        }
        
    }, [transferApproved])

    if (props.nftMintContract) {
        props.nftMintContract.on("Approval", (owner: any, approved: any, token: any) => {
            if (token.toString() === props.nft.token_id && approved === "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98") {
                setTransferApproved(true);
                setIsLoadingApproval(false);
            }

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
                    
                    <h4>Token ID: {props.nft.token_id} </h4>
                    <h4>Token Name: {JSON.parse(props.nft.metadata).name} </h4>
                    <img src={JSON.parse(props.nft.metadata).image}></img>
                    <p>Description: {JSON.parse(props.nft.metadata).description} </p>
                    <h6>Token type: {props.nft.contract_type} </h6>
                    <h6>Block minted: {props.nft.block_number_minted} </h6>
                </div>
                <div>
                    {nftValueUSD
                        ? <>
                            <div>
                                <p>{`This NFT has a value of ${nftValueUSD} $, which is equivalent to ${(nftValueUSD / props.ethUsdPrice).toFixed(4)} ETH`} </p>
                            </div>
                            <p> You can only ask a maximum of the 50% of the asset </p>
                            {isPriceUSD
                                ?
                                <>
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
                           
                            }
                             <br/>
                        <div style={styles.groupButtons}>
                        {contractTransferApproved === "0x997853A0a4737Caaa3363804BbD2a1c290bf7F98"
                            ?
                            <Button size={'medium'} onClick={() => {
                                props.depositNFT(loanAmountETH , props.nft.token_id)}
                            }>{translations.t("deposit")} </Button>
                            : !isLoadingApproval ?
                                <Button size={'medium'} onClick={async() => {
                                    await props.nftMintContract.approve("0x997853A0a4737Caaa3363804BbD2a1c290bf7F98", props.nft.token_id)
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

    