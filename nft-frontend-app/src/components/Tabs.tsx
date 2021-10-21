import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Borrow from '../pages/Borrow';
import Lend from '../pages/Lend';
import Pool from '../pages/Pool';
import 'react-tabs/style/react-tabs.css';
import Vote from '../pages/Vote';
import Liquidate from '../pages/Liquidate';
import { useTranslation } from "react-i18next";
import { Protocol } from '../dtos/protocol';

export interface AccountProps {
  account: string,
  ethBalance: number,
  protocolVariables: Protocol,
  loanContract: any,
  nftMintContract:any,
  realStateValueContract: any,
  oracleChainLinkContract: any,
  provider: any,
  getAccount?: any,
}


function HeaderTabs(props: AccountProps) {

    const translations = useTranslation("translations");

    return (
        <Tabs>
        <TabList className={styles.tabs}>
          <Tab>{translations.t("borrow")}</Tab>
          <Tab>{translations.t("loans")}</Tab>
          <Tab>{translations.t("pool")}</Tab>
          <Tab>{translations.t("liquidate")}</Tab>
          <Tab>{translations.t("vote")}</Tab>
        </TabList>
    
        <TabPanel>
          <Borrow {...props} />
        </TabPanel>
        <TabPanel>
          <Lend {...props} />
        </TabPanel>
        <TabPanel>
          <Pool {...props} />
        </TabPanel>
        <TabPanel>
          <Liquidate {...props} />
        </TabPanel>
        <TabPanel>
          <Vote {...props}  />
        </TabPanel>
      </Tabs>
    )
  }

  const styles = {
    tabs: {
        width: '50%',
    },
  }

export default HeaderTabs;