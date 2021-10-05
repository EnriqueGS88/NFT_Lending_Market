import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Borrow from '../pages/Borrow';
import Pool from '../pages/Pool';
import 'react-tabs/style/react-tabs.css';
import Vote from '../pages/Vote';
import Liquidate from '../pages/Liquidate';


export interface AccountProps {
  account: string,
  getAccount?: any,
}

function HeaderTabs(props: AccountProps) {

    return (
        <Tabs>
        <TabList className={styles.tabs}>
          <Tab>Borrow</Tab>
          <Tab>Pool</Tab>
          <Tab>Liquidate</Tab>
          <Tab>Vote</Tab>
        </TabList>
    
        <TabPanel>
          <Borrow {...props} />
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