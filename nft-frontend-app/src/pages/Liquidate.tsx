import React, {useEffect, useState }  from 'react';
import {House} from '../dtos/houses';
import HouseItem from '../components/HouseItem';

import realStateData from '../data/real-state.json';
import { AccountProps } from '../components/Tabs';

import { useTranslation } from "react-i18next";

declare const window: any;

function Liquidate(props: AccountProps) {
    const [pntkMyBalance, setMyPntkBalance] = useState(0);
    const [ethMyBalance, setMyEthBalance] = useState(0);
    const [houses, setHouses] = useState<JSX.Element[]>();

    const translations = useTranslation("translations");

    
    useEffect(() => {
        const getHouses = async() => {
            const housesItems = [] as JSX.Element[];
            const arrayHouses: House[] = realStateData.houses;
            arrayHouses.forEach((house) => {
                housesItems.push(
                    <HouseItem
                      key={house.title}
                      house={house}
                    />);
            });
            setHouses(housesItems);
        }
        getHouses();
        setMyPntkBalance(0);
        setMyEthBalance(0);
    },[]);

    return (
        <div>
            <h3>{translations.t("borrow")}</h3>
            {props.account !== '' &&
                <div>
                <h6>{translations.t("pntkBalance", { pntkBalance: pntkMyBalance }) }</h6>
                    <p>{translations.t("whenCanLiquidate")}</p>

                    <p>{translations.t("listHouses")}</p> 
                    <ul style={styles.list}>{houses}</ul>
                </div>
            }
            {props.account === '' &&
                <p>{translations.t("connectMetamask")}</p>
            }

        </div>
    )
  }

const styles = {
    input: {
        width: '50%',
        marginLeft: '25%'
    },
    list: {
        listStyleType:"none",
    },
}
export default Liquidate;