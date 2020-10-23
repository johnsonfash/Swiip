import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import { AppFooter, AppHeader, AppSidebar, AppSidebarMinimizer, AppBreadcrumb2 as AppBreadcrumb, AppSidebarNav2 as AppSidebarNav } from '@coreui/react';
import { removeAuthState, getAuthUserType } from '../../services/Auth';

// sidebar nav config
import { customer, agent, admin } from '../../_nav';
// import navigation from '../../_nav';
// routes config
import { adminRoutes, agentRoutes, customerRoutes } from '../../routeList';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.signOut = this.signOut.bind(this);
    // this.navPicker = this.navPicker.bind(this);
  }

  signOut(e) {
    e.preventDefault();
    removeAuthState();
    window.location.reload(true);
    // this.props.history.push('/login')
  }

  navPicker(user_type, customerTab, agentTab, adminTab) {
    return {
      'customer': customerTab,
      'agent': agentTab,
      'admin': adminTab
    }[user_type];
  }

  routePicker(user_type, cusRoutes, agtRoutes, admRoutes) {
    return {
      'customer': cusRoutes,
      'agent': agtRoutes,
      'admin': admRoutes
    }[user_type];
  }

  render() {
    const mystyle = {
      backgroundColor: "white",
    };

    const routes = this.routePicker(getAuthUserType(), customerRoutes, agentRoutes, adminRoutes);
    const nav = this.navPicker(getAuthUserType(), customer, agent, admin);
    return (
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader onLogout={e => this.signOut(e)} />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarNav navConfig={nav} {...this.props} router={router} />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main" style={mystyle}>
            <AppBreadcrumb appRoutes={routes} router={router} />

            <Container fluid >
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={props => (
                        <route.component {...props} />
                      )} />
                  ) : (null);
                })}
                {/* <Redirect from="/" to="/order" /> */}
              </Switch>
            </Container>
          </main>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
