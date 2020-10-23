import React, { Component } from 'react'
import { Button, Col, Container, Row, Input } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getAuthEmail, getAuthUserType } from '../../../services/Auth';
import { sendFetchAccountData, resetUserData } from '../../../store/actions/user';

class Message extends Component {
  constructor(props) {
    super(props)

    this.state = {
      screen: '',
      email: ''
    }
    this.changeDisplayOpt = this.changeDisplayOpt.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  changeDisplayOpt(screen) {
    this.setState(
      {
        screen
      }
    );
  };

  handleChange(e) {
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  };

  componentDidMount() {
    const { resetUserData } = this.props;
    if (getAuthEmail() && getAuthUserType()) {
      this.props.history.push('/order');
    } else {
      resetUserData();
      if (this.props.location.state !== undefined) {
        if (this.props.location.state.data === "registration_success") {
          this.props.history.replace('/message', { data: "" });
          this.changeDisplayOpt('registration_success');
        };
      };
    }
  };

  componentDidUpdate(prevProps) {
    let { userloading, userData } = this.props.userData;
    if (this.props !== prevProps) {
      if (userData.length !== 0) {
        // console.log(userData);
        if (userData.error === 'false' && userloading === 'done') {
          this.changeDisplayOpt('password_reset_success');
        };
      };
    };
  };

  handleSubmit(e) {
    e.preventDefault();
    const { email } = this.state;
    let data = JSON.stringify({ email });
    let formData = new FormData();
    formData.append('request', 'reset_pass');
    formData.append('data', encodeURIComponent(data));
    let { sendFetchData } = this.props;
    sendFetchData(formData);
  };

  render() {
    let dataDisplayed = '';
    let buttonText = '';
    let notification = '';
    const { screen , email } = this.state;
    const { userloading, error, errorMessage, userData } = this.props.userData;
    error === 'true' && errorMessage !== '' ? (notification = errorMessage)
      : (userData.error === 'true' ? (notification = userData.errorMessage) : (notification = ''));
    userloading === 'done' ? (buttonText = 'RESET PASSWORD') :
      (userloading === 'true' ? (buttonText = <div id="loader"></div>) : (buttonText = 'RESET PASSWORD'));

    switch (screen) {
      case 'password_reset_success':
        dataDisplayed = <>
          <br />
          <h3 align="center"> Password Reset Successful</h3><br />
          <h5 style={{ backgroundColor: '#e0f0d7', padding: '0.7em', borderRadius: '0.5em' }}> <span role="img" className="check_mark"> &#10004;</span>Your password has been sent to your email address.</h5> <br />
          <h5>Click <Link to="/login">here</Link> to return to the login page</h5><br />
        </>;
        break;
      case 'registration_success':
        dataDisplayed = <>
          <div className="clearfix" >
            <br />
            <h6 className="float-left display-4"><span role="img" aria-label="confirmed" className="check_mark"> &#10004;</span></h6>
            <h5 className="pt-3">Registered Successfully!</h5>
            <p>Check your email for login details</p>
            <h5>Click <Link to="/login">here</Link> to return to the login page</h5><br />
          </div>
        </>;
        break;
      default:
        dataDisplayed = <>
          <form onSubmit={this.handleSubmit}>
            <br />
            <h3 align="center"> Password Assistant</h3><br />
            <h5> <span role="img" aria-label="issue" style={{ fontSize: '2em', marginRight: '0.5em' }}>😅</span> Please enter the email address associated with your account.
            We will send you a new password!</h5> <br />
            <Input type="text" id="email" value={email} onChange={this.handleChange} placeholder="Email" autoComplete="email" required />
            <span className="error">{notification}</span> <br /><br /><br/>
            <Button type="submit" color="success" block>{buttonText}</Button> <br />
          </form>
        </>;
        break;
    };


    return (
      <div className="app flex-row align-items-center background_image">
        <Container>
          <Row className="justify-content-center" style={{ backgroundColor: 'white', borderRadius: '1em', border: '1px solid darkgrey' }}>
            <Col>
              {dataDisplayed}
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
)(Message);