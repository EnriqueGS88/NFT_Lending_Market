import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Collateral from './Collateral';
import Loans from './Loans';

function Borrow() {

    return (
        <div>
            <p>Borrow</p>
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