import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AccountProps } from '../components/Tabs';
import colors from '../config/colors';
import Collateral from './Collateral';
import Loans from './Loans';

function Borrow(props: AccountProps) {

    return (
        <div>
            <h1>Borrow</h1>
            <p>In order to apply for a Loan you first have to deposit a real state NFT as a collateral.</p>
            <p> Then borrow up to 100% the value of your collateral in ETH.</p>
            <Tabs indicatorColor={colors.bluePurple}>
                <TabList className={styles.tabs}>
                    <Tab>Collateral</Tab>
                    <Tab>Loans</Tab>
                </TabList>
            
                <TabPanel className={styles.tabs}>
                    <Collateral {...props}/>
                </TabPanel>
                <TabPanel>
                    <Loans {...props}/>
                </TabPanel>
            </Tabs>
        </div>
    )
  }

const styles = {
    tabs: {
        width: '50%',
        backgroundColor: colors.bluePurple
    },
}
export default Borrow;