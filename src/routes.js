/* eslint-disable linebreak-style */
/* eslint-disable import/no-cycle */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Router, Route as DefaultRoute, Switch, Redirect } from 'react-router-dom';
import history from './history';
import Login from './views/Pages/Login';
import Register from './views/Pages/Register';
import Message from './views/Pages/Message/Message';
import DefaultLayout from './containers/DefaultLayout';
import Test from './components/Payment/Test'
import { getAuthEmail, getAuthUserType } from './services/Auth';

// @desc  A function to check if user is authenticated. Check if token exists
// @ex    const isAuth = isAuthenticated()
// const isAuthenticated = () => true;

// @desc    This is a function that create protected/private routes.
//          It makes use of isAuthenticated function to check if the user
//          has the access right to the route.
// @use   <PrivateRoute path="<name of path>" component={Component to render} />
// @ex    <PrivateRoute path="/sign-in" component={SignInPage} />
const PrivateRoute = ({ component: Component, ...rest }) => (
  <DefaultRoute
    {...rest}
    render={(props) => (getAuthEmail() && getAuthUserType() ? (
      <Component {...props} />
    ) : (
        <Redirect
          to={{
            pathname: '/login'
          }}
        />
      ))
    }
  />
);

// @desc    This is a function that create default/public/unprotected routes.
// @use     <Route exact path="<name of path>" component={Component to render} />
// @ex      <Route exact path="/" component={LandingPage} />
const Route = ({ component: Component, ensureNonAuth, ...rest }) => (
  <DefaultRoute {...rest} render={(props) => <Component {...props} />} />
);

// @desc  All routes goes here. Either private of public

export default () => (
  <Router history={history}>
    <Switch>
      <Route ensureNonAuth exact path="/login" component={Login} />
      <Route ensureNonAuth exact path="/message" component={Message} />
      <Route ensureNonAuth exact path="/register" component={Register} />
      <PrivateRoute path="/" name="Home" component={DefaultLayout} />
    </Switch>
  </Router>
);
