import React, {useState} from 'react';
import { Button } from 'rimble-ui';

import { useTranslation } from "react-i18next";
import { Protocol } from '../dtos/protocol';

export interface NFTProps {
    key: number,
    nft: any,
    protocolVariables: Protocol,
    depositNFT: Function,
    getNFTprice: Function,
}

function NFT(props: NFTProps) {

    const translations = useTranslation("translations");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [NFTmetadata, setNFTmetadata] = useState(JSON.parse(props.nft.metadata));
    const [loanAmount, setLoanAmount] = useState(0);
    
    return (
        <>
            {console.log("nft", JSON.parse(props.nft.metadata))}
            {console.log("image", JSON.parse(props.nft.metadata).image)}
            <div className="nft" style={{border: "3px solid black", margin: "10px"}}>
                <div>
                    <h4>Token ID: {props.nft.token_id} </h4>
                    {/* <img src={NFTmetadata.image} /> */}
                </div>
                <div>
                    <Button onClick={async () => {
                        await props.getNFTprice(props.nft.metadata);
                    }}>{translations.t("calcularNFTprice")}</Button>
                    <form onSubmit={async (event) => {
                        event.preventDefault();
                        await props.depositNFT(loanAmount , props.nft.token_id)}
                    } >
                    <label>{"Set how much ETH would you like"} </label> 
                    <input
                        type="number"
                        min={0.01}
                        step={0.01}
                        onChange={(e:any) => {
                            setLoanAmount(e.target.value);
                        }}
                        value={loanAmount}
                        required={true}
                    />
                    <Button type="submit">{translations.t("deposit")}</Button>
                </form>
                </div>
            </div>
        </>
    );
  }

export default NFT;