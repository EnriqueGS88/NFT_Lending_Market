import React, {useState, useEffect} from 'react';
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
}

function NFT(props: NFTProps) {

    const translations = useTranslation("translations");

    const [NFTmetadata, setNFTmetadata] = useState({} as NFTObject);
    const [loanAmount, setLoanAmount] = useState(0);

    console.log(".......");
    console.log(NFTmetadata);
    //TODO: Image is broken
    useEffect(() => {
        const nft: NFTObject = JSON.parse(props.nft.metadata);
        setNFTmetadata(nft);
    },[]);

    return (
        <div style={styles.listItem}>
            <Card border={1} borderColor={colors.bluePurple}>
            <h4>{NFTmetadata.name}</h4> 

                    {/* <td>
                        <img src={NFTmetadata.image} alt="imageNFT" width="500" height="400" />
                    </td> */}

                        {NFTmetadata.attributes && <h6>Attributes: {NFTmetadata.attributes}</h6> }
                        <div style={styles.description}><p>{NFTmetadata.description}</p></div>
                        

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
                    <br/>
                    <div style={styles.groupButtons}>
                        <Button size={'medium'} onClick={async () => {
                            await props.getNFTprice(props.nft.metadata);
                        }}>Calculate NFT Price</Button>
                        <div style={styles.divider}/>
                        <Button type="submit" size={'medium'}>{translations.t("deposit")}</Button>
                    </div>
                </form>

        </Card>
            {/* <div className="nft" style={{border: "3px solid black", margin: "10px"}}>
                <div>
                    <h4>Token ID: {props.nft.token_id} </h4>
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
            </div>  */}
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