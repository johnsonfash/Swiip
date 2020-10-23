import React, { Component } from 'react';
import {
  Button, Card, CardBody, Col, Container, Form, Input, InputGroup
  , InputGroupAddon, InputGroupText, Row, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { getAuthEmail, getAuthUserType } from '../../../services/Auth';
import { sendFetchAccountData, resetUserData } from '../../../store/actions/user';

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      phoneNumber: '',
      name: '',
      gender: 'Male',
      birthday: '',
      state: 'Abuja',
      country: 'Nigeria',
      companyName: '',
      address: '',
      formFor: 'customer',
      activeTab: ["1"]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggle(tab, user) {
    this.setState({
      formFor: user,
      activeTab: [tab]
    });
  };

  form(formFor) {
    let formOption;
    let buttonText = '';
    let notification = '';
    const { email, phoneNumber, name, gender, birthday, state, country, companyName, address } = this.state;
    const { userloading, error, errorMessage, userData } = this.props.userData;
    error === 'true' && errorMessage !== '' ? (notification = errorMessage)
      : (userData.error === 'true' ? (notification = userData.errorMessage) : (notification = ''));
    userloading === 'done' ? (buttonText = 'Create Account') :
      (userloading === 'true' ? (buttonText = <div id="loader"></div>) : (buttonText = 'Create Account'));

    if (formFor === 'customer') {
      formOption = <>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fa fa-user"></i>
            </InputGroupText>
          </InputGroupAddon>
          <Input type="text" id="name" value={name} onChange={this.handleChange} placeholder="Surname - Space - Name" autoComplete="name" required />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText><span role="img" aria-label="name">&#9892;</span></InputGroupText>
          </InputGroupAddon>
          <Input type="select" id="gender" value={gender} onChange={this.handleChange}>
            <option>Male</option>
            <option>Female</option>
          </Input>
        </InputGroup>
        <InputGroup className="mb-4" >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <span role="img" aria-label="name">&#128198; &nbsp; Birth</span>
            </InputGroupText>
          </InputGroupAddon>
          <Input type="date" id="birthday" value={birthday} onChange={this.handleChange} max="2030-12-30" min="1940-01-01" placeholder="yyyy-mm-dd" required />
        </InputGroup>
      </>;
    } else {
      formOption = <>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <span role="img" aria-label="name">&#127963;</span>
            </InputGroupText>
          </InputGroupAddon>
          <Input type="text" id="companyName" value={companyName} onChange={this.handleChange} placeholder="Company FULL Name" autoComplete="company" required />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <span role="img" aria-label="name">&#9942;</span>
            </InputGroupText>
          </InputGroupAddon>
          <Input type="textarea" style={{ height: '6.7em' }} id="address" value={address} onChange={this.handleChange} placeholder="Company Address" autoComplete="address" required />
        </InputGroup>
      </>;
    }

    return (
      <Form onSubmit={this.handleSubmit} method="post" id={formFor}>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText><i className="fa fa-envelope"></i></InputGroupText>
          </InputGroupAddon>
          <Input type="text" id="email" value={email} onChange={this.handleChange} placeholder="Email" autoComplete="email" required />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <span role="img" aria-label="phone">&#9742;</span>
            </InputGroupText>
          </InputGroupAddon>
          <Input type="text" id="phoneNumber" value={phoneNumber} onChange={this.handleChange} placeholder="Phone Number" autoComplete="phone number" required />
        </InputGroup>
        {formOption}
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText><span role="img" aria-label="name">&#9873;</span></InputGroupText>
          </InputGroupAddon>
          <Input type="select" id="state" value={state} onChange={this.handleChange}>
            <option>Abuja</option>
            <option>Ibadan</option>
            <option>Lagos</option>
          </Input>
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroupAddon addonType="prepend">
            <InputGroupText><span role="img" aria-label="name">&#9873;</span></InputGroupText>
          </InputGroupAddon>
          <Input type="select" id="country" value={country} onChange={this.handleChange} disabled>
            <option>Nigeria</option>
            <option>Ghana</option>
            <option>Kenya</option>
          </Input>
        </InputGroup>
        <span className="error">{notification}</span> <br /><br />
        <Button type="submit" color="success" block>{buttonText}</Button>
      </Form>
    )
  }

  handleChange(e) {
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  };

  latLngPicker(state) {
    return {
      'Abuja': '{ "lat": 9.083349, "lng": 7.536111 }',
      'Ibadan': '{ "lat":7.442969, "lng": 3.894776 }',
      'Lagos': '{ "lat":6.606204, "lng": 3.347276 }'
    }[state];
  }


  handleSubmit(e) {
    e.preventDefault();
    let json;
    const { email, phoneNumber, name, gender, birthday, state, country, companyName, address, formFor } = this.state;
    const regDate = new Date();
    const month = regDate.getUTCMonth() + 1;
    const day = regDate.getUTCDate();
    const year = regDate.getUTCFullYear();
    const newdate = year + "-" + month + "-" + day;
    formFor === 'customer' ? (
      json = JSON.stringify({ email, phoneNumber, name, gender, birthday, "defaultAddress": `${state} State, ${country} (Please change)`, "defaultLatLng": this.latLngPicker(state), state, country })) :
      (json = JSON.stringify({ email, phoneNumber, "name": companyName, gender, "birthday": newdate, "defaultAddress": address, "defaultLatLng": this.latLngPicker(state), state, country }));
    let formData = new FormData();
    formData.append('request', 'register');
    formData.append('user_type', formFor);
    formData.append('data', encodeURIComponent(json));
    let { sendFetchData } = this.props;
    sendFetchData(formData);
  };


  componentDidMount() {
    const { resetUserData } = this.props;
    if (getAuthEmail() && getAuthUserType()) {
      this.props.history.push('/order');
    } else {
      resetUserData();
    }
  };

  componentDidUpdate(prevProps) {
    let { userloading, userData } = this.props.userData;
    if (this.props !== prevProps) {
      console.log(userData)
      if (userData.length !== 0) {
        if (userData.error === 'false' && userloading === 'done') {
          this.props.history.push('/message', { data: "registration_success" })
        };
      };
    };
  };

  render() {
    let customerTab, agentTab;
    if (this.state.activeTab[0] === '1') {
      customerTab = this.form('customer');
      agentTab = '';
    } else {
      customerTab = '';
      agentTab = this.form('agent');
    }

    return (
      <div className="app flex-row align-items-center background_image">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <br />
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Register</h1>
                  <p className="text-muted">Create your account</p>
                  <Nav tabs>
                    <NavItem style={{ width: '50%', textAlign: 'center' }}>
                      <NavLink
                        active={this.state.activeTab[0] === '1'}
                        onClick={() => { this.toggle('1', 'customer'); }}
                      >
                        Customer
                </NavLink>
                    </NavItem>
                    <NavItem style={{ width: '50%', textAlign: 'center' }} title="disabled">
                      <NavLink
                        active={this.state.activeTab[0] === '2'}
                        onClick={() => { this.toggle('2', 'agent'); }}
                      >
                        Agent
                </NavLink>
                    </NavItem>
                  </Nav>
                  <TabContent activeTab={this.state.activeTab[0]}>
                    <TabPane tabId="1">
                      {customerTab}
                    </TabPane>
                    <TabPane tabId="2">
                      {agentTab}
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetUserData: () => dispatch(resetUserData()),
    sendFetchData: (data) => dispatch(sendFetchAccountData(data))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Register);