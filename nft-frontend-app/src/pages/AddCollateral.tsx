/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Loader from "react-loader-spinner";

import { ethers } from 'ethers';

import NFT from './NFT';
import { Protocol } from '../dtos/protocol';

export interface AddCollateralProps {
    account: string,
    loans: Array<any>,
    protocolVariables: Protocol,
    loanContract: any,
    provider: any,
    nfts: Array<any>,
    isLoading: boolean,
}

function AddCollateral(props: AddCollateralProps) {

    const translations = useTranslation("translations");
    const [depositsPendingConfirmation, setDepositsPendingConfirmation] = useState<any[any]>([]);
    const [userNFTs, setUserNFTs] = useState<any[any]>([]);

    useEffect(() => {
        const nfts = props.nfts.filter(nft => {
            return !props.loans.find(loan => loan.tokenIdNFT === nft.token_id) && !depositsPendingConfirmation.includes(nft.token_id)
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
        setDepositsPendingConfirmation(depositsStillPending);
    }, [props.loans])

    
    async function depositNFT(etherAmount: number, tokenId: number) {
        if (etherAmount <= 0) return;

        const loanAmount = ethers.utils.parseEther(etherAmount.toString());
        const interestAmount = ethers.utils.parseEther(((props.protocolVariables.interestRate / 100) * etherAmount).toString());
        const maximumPeriod = props.protocolVariables.maximumPaybackMonths;
        const smartContractNFTAddress = "0x3143623f5f13baf4a984ba221291afb0fd81d854";

        try {
            await props.loanContract.createLoanRequest(smartContractNFTAddress, tokenId, loanAmount, interestAmount, maximumPeriod);
            setDepositsPendingConfirmation(depositsPendingConfirmation.push(tokenId))
        } catch (error) {
            console.log("error", error);
        }
    }
    

    return (
        <div>
            <h3>{translations.t("depositCollateral")}</h3>
            {props.account !== '' &&
                <div>
                {props.isLoading
                    ?  <Loader type="Oval" color="#000" height={70} width={70} />
                    : userNFTs.length === 0
                        ? <p>{translations.t("noNFT")}</p>
                        : userNFTs.map((nft:any) => (
                            <NFT key={nft.token_id} nft={nft} protocolVariables={props.protocolVariables} depositNFT={depositNFT} />
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
export default AddCollateral;