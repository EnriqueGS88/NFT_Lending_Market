import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Borrow from '../pages/Borrow';
import Pool from '../pages/Pool';
import 'react-tabs/style/react-tabs.css';

function HeaderTabs() {

    return (
        <Tabs>
        <TabList>
          <Tab>Borrow</Tab>
          <Tab>Pool</Tab>
          <Tab>Info</Tab>
        </TabList>
    
        <TabPanel>
          <Borrow />
        </TabPanel>
        <TabPanel>
          <Pool />
        </TabPanel>
      </Tabs>
    )
  }

export default HeaderTabs;