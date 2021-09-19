import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Collateral from './Collateral';
import Loans from './Loans';

function Borrow() {

    return (
        <div>
            <h1>Borrow</h1>
            <p>In order to apply for a Loan you first have to deposit a real state NFT as a collateral.</p>
            <p> Then borrow up to 100% the value of your collateral in ETH.</p>
            <Tabs >
                <TabList className={styles.tabs}>
                    <Tab>Collateral</Tab>
                    <Tab>Loans</Tab>
                </TabList>
            
                <TabPanel>
                    <Collateral />
                </TabPanel>
                <TabPanel>
                    <Loans />
                </TabPanel>
            </Tabs>
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
    tabs: {
        width: '50%',
    },
}
export default Borrow;