import React, {useState, useEffect} from 'react';
import { Button } from 'rimble-ui';

import { useTranslation } from "react-i18next";
import { Protocol } from '../dtos/protocol';
import Loader from 'react-loader-spinner';


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
        <>
            {console.log("nft", isPriceUSD)}
            <div className="nft" style={{border: "3px solid black", margin: "10px"}}>
                <div>
                    <h4>Token ID: {props.nft.token_id} </h4>
                    {/* <img src={NFTmetadata.image} /> */}
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
                            <Button onClick={() => {
                                props.depositNFT(loanAmountETH , props.nft.token_id)}
                            }>{translations.t("deposit")}</Button>
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
            </div>
        </>
    );
  }

export default NFT;