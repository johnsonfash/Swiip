/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import history from '../../../history';

const styles = (theme) => ({
  ...theme.spreadthis
});

export class login extends Component {
  render() {
    return (
      <Fragment>
        <div>This is the sign in page</div>
        <button onClick={() => history.push('/')}>Landing Page</button>
      </Fragment>
    );
  }
}

export default withStyles(styles)(login);
