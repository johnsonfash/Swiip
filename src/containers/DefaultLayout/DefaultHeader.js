import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';
// import profileImage from '../../assets/img/avatar/profile_image.png';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { getAuthImage } from '../../services/Auth';
// import logo from '../../assets/img/brand/logo.svg'
import sweeperLogo from '../../assets/img/brand/sweeper_logo.png';
import sweeperLogoSmall from '../../assets/img/brand/sweeper_small_logo.png';
// import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: sweeperLogo, width: 120, height: 30, alt: 'Broomy Logo' }}
          minimized={{ src: sweeperLogoSmall, width: 30, height: 30, alt: 'Broomy Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-3">
            <NavLink to="/account" className="nav-link">Settings</NavLink>
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src={getAuthImage()} className="img-avatar" alt="user" style={{border:'1px solid lightgrey'}} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-envelope"></i> Message</DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><NavLink to="/account" className="nav-link" style={{color:'black'}}><i className="fa fa-user"></i> Profile</NavLink></DropdownItem>
              <DropdownItem><i className="fa fa-money"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-sign-out"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
