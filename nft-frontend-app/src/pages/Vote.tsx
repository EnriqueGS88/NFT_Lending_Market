import React, {useEffect, useState }  from 'react';
import {Protocol} from '../dtos/protocol';
import { AccountProps } from '../components/Tabs';
import { useTranslation } from "react-i18next";


export interface VoteProps {
    account: string,
    ethBalance: number,
    protocolVariables: Protocol,
}

function Vote(props: AccountProps) {
    const [pntkMyBalance, setMyPntkBalance] = useState(0);

    const translations = useTranslation("translations");

    useEffect(() => {
        setMyPntkBalance(0);
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
                        <p>{props.protocolVariables?.interestRate} %</p>
                    </div>
                    <div>
                        <h6>{translations.t("minimumPayback")}</h6>
                        <p>{props.protocolVariables?.minimumPaybackMonths}</p>
                    </div>
                    <div>
                        <h6>{translations.t("maximumPayback")}</h6>
                        <p>{props.protocolVariables?.maximumPaybackMonths}</p>
                    </div>
                    <div>
                        <h6>{translations.t("conditionsReview")}</h6>
                        <p>{props.protocolVariables?.conditionsReviewPeriod}</p>
                    </div>
                    <div>
                        <h6>{translations.t("votePeriod")}</h6>
                        <p>{props.protocolVariables?.votePeriod} %</p>
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
export default Vote;