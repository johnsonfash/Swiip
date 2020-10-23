import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { AppSwitch } from '@coreui/react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getAuthEmail, authenticateUser, getAuthUserType } from '../../../services/Auth';
import { htmlspecialchars_decode } from '../../../utils/utilityFunction'
import {
  Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup,
  InputGroupAddon, InputGroupText, Row
} from 'reactstrap';
import { sendFetchAccountData, resetUserData } from '../../../store/actions/user';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      keep_signIn: false,
      buttonText: '',
      notification: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange(e) {
    this.setState(
      {
        [e.target.id]: (() => (e.target.id === 'keep_signIn' ? (e.target.checked) : (e.target.value)))()
      }
    );
  };

  handleSubmit(e) {
    e.preventDefault();
    let { sendFetchData } = this.props;
    const { email, password } = this.state;
    let data = JSON.stringify({ email, password });
    let formData = new FormData();
    formData.append('request', 'login');
    formData.append('data', encodeURIComponent(data));
    sendFetchData(formData);
  }

  componentDidMount() {
    const { resetUserData } = this.props;
    if (getAuthEmail() && getAuthUserType()) {
      this.props.history.push('/account');
    } else {
      resetUserData();
    }
  };

  componentDidUpdate(prevProps) {
    let stayingDuration = '';
    const { userloading, error, errorMessage, userData } = this.props.userData;
    const { keep_signIn } = this.state;

    if (this.props !== prevProps) {
      if (error === 'true' && errorMessage !== '') {
        this.setState({
          notification: errorMessage
        });
      }
      if (userData.length !== 0) {
        if (userData.error === 'false' && userloading === 'done' && userData.message === 'Login success') {
          keep_signIn === true ? (stayingDuration = 'local') : (stayingDuration = 'session');
          const { id, email, name, user_type, token, image, defaultLatLng } = userData.data[0];
          authenticateUser(id, name, email, user_type, token, image, htmlspecialchars_decode(defaultLatLng), stayingDuration);
          this.props.history.push('/account');
        } else {
          this.setState({
            notification: userData.errorMessage
          });
        }
      };
    };
  };

  render() {
    let buttonText = '';
    const { email, password, notification } = this.state;
    const { userloading } = this.props.userData;
    userloading === 'done' ? (buttonText = 'Login') :
      (userloading === 'true' ? (buttonText = <div id="loader"></div>) : (buttonText = 'Login'));
      
    return (
      <div className="app flex-row align-items-center background_image">
        <Container>
          <Row className="justify-content-center">
            <Col md="9">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit} method="post">
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <span className="error">{notification} </span>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" id="email" value={email} onChange={this.handleChange} placeholder="Email" autoComplete="email" required />
                      </InputGroup>

                      <span className="error">{notification}</span>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" id="password" value={password} onChange={this.handleChange} placeholder="Password" autoComplete="password" required />
                      </InputGroup>
                      <Row>
                        <Col xs="7" style={{ paddingRight: '0px' }}>
                          <span id="switch"><AppSwitch onChange={this.handleChange} id="keep_signIn" className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'} /></span>
                        &nbsp; Remember me
                        </Col>
                        <Col xs="5" className="text-right">
                          <Button color="link" className="px-0"><Link to="/message" style={{fontSize:'0.85em'}}>Forgot password?</Link></Button>
                        </Col>
                      </Row>
                      <Row className="login_register">
                        <Col xs="6" >
                          <Button color="primary" type="submit" className="px-4">{buttonText}</Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Link to="/register">
                            <Button color="dark" className="px-3">Register</Button>
                          </Link>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Welcome to Broomy. <br /> This website is  currently under development, but you can create your customer account by clicking on the link below! </p>
                      <Link to="/register">
                        <Button color="primary" className="mt-3" active tabIndex={-1}>Register Now!</Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
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
)(Login);