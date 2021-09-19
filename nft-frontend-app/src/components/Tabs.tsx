import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Borrow from '../pages/Borrow';
import Pool from '../pages/Pool';
import 'react-tabs/style/react-tabs.css';
import Vote from '../pages/Vote';
import Liquidate from '../pages/Liquidate';

function HeaderTabs() {

    return (
        <Tabs>
        <TabList>
          <Tab>Borrow</Tab>
          <Tab>Pool</Tab>
          <Tab>Liquidate</Tab>
          <Tab>Vote</Tab>
        </TabList>
    
        <TabPanel>
          <Borrow />
        </TabPanel>
        <TabPanel>
          <Pool />
        </TabPanel>
        <TabPanel>
          <Liquidate />
        </TabPanel>
        <TabPanel>
          <Vote />
        </TabPanel>
      </Tabs>
    )
  }

export default HeaderTabs;