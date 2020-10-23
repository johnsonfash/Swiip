import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        <span><a href="https://swiip.000webhostapp.com">Swiip</a> &copy; 2020 Clean-Initiative.</span>
        <span className="ml-auto">Contact Us @ <a href="https://swiip.000webhostapp.com/contact">Swiip desk</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
