// import React from 'react';
import { getAuthUserType } from './services/Auth'
import Order from './views/Order';
import CustomerMap from './views/Map/CustomerMap';
import AgentMAp from './views/Map/AgentMAp'
import Summary from './views/Order/Summary';
import Community from './views/Community';
import New from './views/Pickups/New';
import Pending from './views/Pickups/Pending';
import History from './views/History';
import Account from './views/Pages/Account';
import Support from './views/Pages/Account/Support';
import Editor from './views/Pages/Account/Editor';
import ReviewAgent from './views/Pages/Account/ReviewAgent';
import ReviewCustomer from './views/Pages/Account/ReviewCustomer';
import Edit from './views/Community/Editor';
import View from './views/Community/View';
import Page404 from './views/Pages/Page404';

let routes;
if ( getAuthUserType() === 'admin') {
  routes = [
    { path: '/community/edit/:id', exact: true, name: 'Edit', component: Edit },
    { path: '/community/edit', exact: true, name: 'Edit', component: Edit },
    { path: '/account/edit', exact: true, name: 'Edit', component: Editor },
    { path: '/community/:id', exact: true, name: 'View', component: View },
    { path: '/account/address', exact: true, name: 'Map', component: CustomerMap },
    { path: '/account', exact: true, name: 'Account', component: Account },
    { path: '/community', exact: true, name: 'Community', component: Community },
    { path: '/customer', exact: true, name: 'Customer', component: ReviewCustomer },
    { path: '/agent', exact: true, name: 'Agent', component: ReviewAgent },
    { path: '/', exact: false, name: 'Home', component: Page404 }

  ];
} else if ( getAuthUserType() === 'agent' ) {
  routes = [
    { path: '/pickups/new', exact: true, name: 'Address', component: New },
    { path: '/pickups/pending', exact: true, name: 'Address', component: Pending },
    { path: '/community/:id', exact: true, name: 'View', component: View },
    { path: '/account/address', exact: true, name: 'Map', component: CustomerMap },
    { path: '/pickups/map', exact: true, name: 'Order', component: AgentMAp },
    { path: '/account', exact: true, name: 'Account', component: Account },
    { path: '/support', exact: true, name: 'Support', component: Support },
    { path: '/community', exact: true, name: 'Community', component: Community },
    { path: '/history', exact: true, name: 'History', component: History },
    { path: '/', exact: false, name: 'Home', component: Page404 }

  ];
} else {
  routes = [
    { path: '/order/summary', exact: true, name: 'Summary', component: Summary },
    { path: '/community/:id', exact: true, name: 'View', component: View },
    { path: '/account/address', exact: true, name: 'Map', component: CustomerMap },
    { path: '/order', exact: true, name: 'Order', component: Order },
    { path: '/account', exact: true, name: 'Account', component: Account },
    { path: '/support', exact: true, name: 'Support', component: Support },
    { path: '/community', exact: true, name: 'Community', component: Community },
    { path: '/history', exact: true, name: 'History', component: History },
    { path: '/', exact: false, name: 'Home', component: Page404 }

  ];
}

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config

export default routes;