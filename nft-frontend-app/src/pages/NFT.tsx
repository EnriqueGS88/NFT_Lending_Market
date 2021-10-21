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
    
    return (
        <div style={styles.listItem}>
            <Card border={1} borderColor={colors.bluePurple}>
                <div>
                    
                    <h4>Token ID: {props.nft.token_id} </h4>
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
                        <Button size={'medium'} onClick={() => {
                                props.depositNFT(loanAmountETH , props.nft.token_id)}
                            }>{translations.t("deposit")} </Button>
                        </div>
                            
                        </>
                        : <>
                            {isLoadingPrice 
                                ? <Loader type="Oval" color="#000" height={70} width={70} />
                                : <Button onClick={async () => {
                                    await props.getNFTprice(props.nft.token_id, props.nft.metadata);
                                    setIsLoadingPrice(true);
                                }}>{translations.t("calcularNFTprice")}</Button>

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

    // return (
    //     <div style={styles.listItem}>
    //         <Card border={1} borderColor={colors.bluePurple}>
    //         <h4>{NFTmetadata.name}</h4> 

    //                 {/* <td>
    //                     <img src={NFTmetadata.image} alt="imageNFT" width="500" height="400" />
    //                 </td> */}

    //                     {NFTmetadata.attributes && <h6>Attributes: {NFTmetadata.attributes}</h6> }
    //                     <div style={styles.description}><p>{NFTmetadata.description}</p></div>
                        

    //                 <form onSubmit={async (event) => {
    //                     event.preventDefault();
    //                     await props.depositNFT(loanAmount , props.nft.token_id)}
    //                 } >
    //                 <label>{"Set how much ETH would you like"} </label> 
    //                 <input
    //                     type="number"
    //                     min={0.01}
    //                     step={0.01}
    //                     onChange={(e:any) => {
    //                         setLoanAmount(e.target.value);
    //                     }}
    //                     value={loanAmount}
    //                     required={true}
    //                 />
    //                 <br/>
    //                 <div style={styles.groupButtons}>
    //                     <Button size={'medium'} onClick={async () => {
    //                         await props.getNFTprice(props.nft.metadata);
    //                     }}>Calculate NFT Price</Button>
    //                     <div style={styles.divider}/>
    //                     <Button type="submit" size={'medium'}>{translations.t("deposit")}</Button>
    //                 </div>
    //             </form>

    //     </Card>