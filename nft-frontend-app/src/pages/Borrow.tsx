import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { AccountProps } from '../components/Tabs';
import colors from '../config/colors';
import Collateral from './Collateral';
import Loans from './Loans';
import { useTranslation } from "react-i18next";


function Borrow(props: AccountProps) {

    const translations = useTranslation("translations");

    return (
        <div>
            <h1>{translations.t("borrow")}</h1>
            <p>{translations.t("depositFirst")}</p>
            <p>{translations.t("afterDeposit")}</p>
            <Tabs indicatorColor={colors.bluePurple}>
                <TabList className={styles.tabs}>
                    <Tab>{translations.t("collateral")}</Tab>
                    <Tab>{translations.t("loans")}</Tab>
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