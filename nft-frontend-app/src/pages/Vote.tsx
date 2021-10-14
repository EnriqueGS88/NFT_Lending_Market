import React, {useEffect, useState }  from 'react';
import { ethers } from 'ethers';
import {Protocol} from '../dtos/protocol';
import { AccountProps } from '../components/Tabs';
import { useTranslation } from "react-i18next";

declare const window: any;
function Vote(props: AccountProps) {
    const [pntkMyBalance, setMyPntkBalance] = useState(0);
    const [protocolVariables, setProtocolVariables] = useState<Protocol>();

    const translations = useTranslation("translations");

    useEffect(() => {
        setMyPntkBalance(0);
        const protocol: Protocol = {
            interestRate: 1,
            minimumPaybackMonths: 12,
            maximumPaybackMonths: 120,
            conditionsReviewPeriod: 'monthly',
            votePeriod: 5,
        }
        setProtocolVariables(protocol);
    },[]);

    return (
        <div>
        <h3>{translations.t("governance")}</h3>
        {props.account !== '' &&
            <div>
                <h6>{translations.t("voteRequirement")}</h6>
                <h6>{translations.t("pntkBalance", { pntkBalance: pntkMyBalance }) }</h6>
                <h4>{translations.t("voteProtocol")}</h4>
                <div>
                    <div>
                        <h6>{translations.t("interestRate")}</h6>
                        <p>{protocolVariables?.interestRate} %</p>
                    </div>
                    <div>
                        <h6>{translations.t("minimumPayback")}</h6>
                        <p>{protocolVariables?.minimumPaybackMonths}</p>
                    </div>
                    <div>
                        <h6>{translations.t("maximumPayback")}</h6>
                        <p>{protocolVariables?.maximumPaybackMonths}</p>
                    </div>
                    <div>
                        <h6>{translations.t("conditionsReview")}</h6>
                        <p>{protocolVariables?.conditionsReviewPeriod}</p>
                    </div>
                    <div>
                        <h6>{translations.t("votePeriod")}</h6>
                        <p>{protocolVariables?.votePeriod} %</p>
                    </div>
                </div>
            </div>
        }
        {props.account === '' &&
            <p>{translations.t("connectMetamask")}</p>
        }

    </div>
    )
  }

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
}
export default Vote;