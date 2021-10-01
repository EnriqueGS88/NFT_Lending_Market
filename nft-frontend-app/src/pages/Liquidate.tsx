import React, {useEffect, useState }  from 'react';
import { ethers } from 'ethers';
import {House} from '../dtos/houses';
import HouseItem from '../components/HouseItem';

import realStateData from '../data/real-state.json';

declare const window: any;
function Liquidate() {
    const [myAddress, setMyAddress] = useState('');
    const [pntkMyBalance, setMyPntkBalance] = useState(0);
    const [ethMyBalance, setMyEthBalance] = useState(0);
    const [houses, setHouses] = useState<JSX.Element[]>();

    useEffect(() => {
        const getMyAccount = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            try{
            const address = await signer.getAddress();
                setMyAddress(address);
            }
            catch(error){
                setMyAddress('');
            }
        }
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
        getMyAccount();
        getHouses();
        setMyPntkBalance(0);
        setMyEthBalance(0);
    },[]);

    return (
        <div>
            <h3>Liquidate</h3>
            {myAddress !== '' &&
                <div>
                    <h6>Your PNTK balance: {pntkMyBalance} PNTK</h6>
                    <p>You can liquidate a collateral with ETH if you have enought ETH and PNTK</p>

                    <p>List houses to liquidate: </p> 
                    <ul style={styles.list}>{houses}</ul>
                </div>
            }
            {myAddress === '' &&
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