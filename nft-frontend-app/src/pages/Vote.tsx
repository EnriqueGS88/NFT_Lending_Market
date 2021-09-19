import React, {useEffect, useState }  from 'react';
import { ethers } from 'ethers';
import {Protocol} from '../dtos/protocol';

declare const window: any;
function Vote() {
    const [myAddress, setMyAddress] = useState('');
    const [pntkMyBalance, setMyPntkBalance] = useState(0);
    const [protocolVariables, setProtocolVariables] = useState<Protocol>();

    useEffect(() => {
        const getMyAccount = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();
            setMyAddress(address);
        }

        getMyAccount();
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
        <h3>Governance</h3>
        {myAddress !== '' &&
            <div>
                <h6>You can vote if you are a PNTK holder</h6>
                <h6>Your PNTK balance: {pntkMyBalance} PNTK</h6>
                <h4>Vote for the protocol</h4>
                <div>
                    <div>
                        <h6>Interest rate</h6>
                        <p>{protocolVariables?.interestRate} %</p>
                    </div>
                    <div>
                        <h6>Minimum Payback Period in Months</h6>
                        <p>{protocolVariables?.minimumPaybackMonths}</p>
                    </div>
                    <div>
                        <h6>Maximum Payback Period in Months</h6>
                        <p>{protocolVariables?.maximumPaybackMonths}</p>
                    </div>
                    <div>
                        <h6>Conditions Review Period</h6>
                        <p>{protocolVariables?.conditionsReviewPeriod}</p>
                    </div>
                    <div>
                        <h6>Vote Period</h6>
                        <p>{protocolVariables?.votePeriod} %</p>
                    </div>
                </div>
            </div>
        }
        {myAddress === '' &&
            <p>Connect with your Metamask Wallet</p>
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