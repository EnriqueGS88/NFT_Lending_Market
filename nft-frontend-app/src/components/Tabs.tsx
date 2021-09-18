import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Borrow from '../pages/Borrow';
import Pool from '../pages/Pool';
import 'react-tabs/style/react-tabs.css';
import Info from '../pages/Info';

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
        <TabPanel>
          <Info />
        </TabPanel>
      </Tabs>
    )
  }

export default HeaderTabs;