import React, {useEffect, useState }  from 'react';
import {House} from '../dtos/houses';
import HouseItem from '../components/HouseItem';

import realStateData from '../data/real-state.json';
import { AccountProps } from '../components/Tabs';

declare const window: any;

function Liquidate(props: AccountProps) {
    const [pntkMyBalance, setMyPntkBalance] = useState(0);
    const [ethMyBalance, setMyEthBalance] = useState(0);
    const [houses, setHouses] = useState<JSX.Element[]>();

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
            <h3>Liquidate</h3>
            {props.account !== '' &&
                <div>
                    <h6>Your PNTK balance: {pntkMyBalance} PNTK</h6>
                    <p>You can liquidate a collateral with ETH if you have enought ETH and PNTK</p>

                    <p>List houses to liquidate: </p> 
                    <ul style={styles.list}>{houses}</ul>
                </div>
            }
            {props.account === '' &&
                <p>Connect with your Metamask Wallet</p>
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