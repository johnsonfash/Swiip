import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getOrderQty, setAuthToken, getAuthUserAll, getAuthUserType, setOrderQty, signOut } from '../../services/Auth';
import { sendFetchAccountData } from '../../store/actions/user';
import { sendFetchOrderData } from '../../store/actions/order';
import { htmlspecialchars_decode } from '../../utils/utilityFunction'
import {
  Button,
  Row
} from 'reactstrap';
import PayStack from '../../components/Payment/PayStack';

class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      quantity: '2',
      price: 400,
      transportFee: 100,
      total: 500,
      email: '',
      firstName: '',
      lastName: '',
      fullName: '',
      phone: '',
      address: '',
      stateCountry: '',
      latLng: '',
      notification: 'Please log out and log back in',
      notifDisplay: 'none'
    };
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.saveOrder = this.saveOrder.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
    });
  }

  close() {
    this.setState({
      notifDisplay: 'none'
    });
  }

  genericState(data) {
    const { email, name, defaultAddress, pickupAddress, pickupLatLng, pickupStateCountry, state, country, phone, defaultLatLng } = data;
    let address = pickupAddress;
    let latLng = pickupLatLng;
    let stateCountry = pickupStateCountry;
    if (address === '') {
      address = defaultAddress;
      latLng = defaultLatLng;
      stateCountry = state + ', ' + country;
    }
    let nameExplode = name.trim().split(/ (.+)/);
    if (nameExplode[1] === undefined) {
      nameExplode[1] = nameExplode[0];
    }
    this.setState({
      email,
      phone,
      lastName: nameExplode[0],
      firstName: nameExplode[1],
      fullName: name,
      address,
      stateCountry,
      latLng
    });
  }

  saveOrder(orderRef) {
    const { quantity, total, email, phone, fullName ,address, stateCountry, latLng } = this.state;
    const json = JSON.stringify({ "personOf": fullName, phone, email, orderRef, "defaultAddress": address,
      stateCountry, "assignedAgent": "pending", "status": "pending", "amount": total.toString(), "orderQty": quantity,
      "pickupAddress": address, "latLng": htmlspecialchars_decode(latLng), ...getAuthUserAll()
    });
    let formData = new FormData();
    formData.append('request', 'new_order');
    formData.append('user_type', getAuthUserType());
    formData.append('data', encodeURIComponent(json));
    let { sendOrderData } = this.props;
    sendOrderData(formData);
    // console.log(json);
  }

  componentDidMount() {
    // console.log(getOrderQty())
    if (getOrderQty()) {
      this.setState({
        quantity: getOrderQty(),
        price: getOrderQty() * 200,
        transportFee: getOrderQty() * 50,
        total: (getOrderQty() * 50) + (getOrderQty() * 200)
      });
    } else {
      setOrderQty(2);
    }

    const data = JSON.stringify(getAuthUserAll());
    const { sendFetchData, userData } = this.props
    if (userData.userData.length === 0) {
      let formData = new FormData();
      formData.append('request', 'get_user');
      formData.append('user_type', getAuthUserType());
      formData.append('data', encodeURIComponent(data));
      sendFetchData(formData);
    } else {
      // const { token, email, name, address, state, country, phone } = userData.userData.data[0];
      this.genericState(userData.userData.data[0]);
      // console.log(userData);
    }
  };

  componentDidUpdate(prevProps) {
    const { userloading, userData } = this.props.userData;
    const { orderloading, orderData } = this.props.orderData;
    if (this.props !== prevProps) {
      // ORDER DATA
      if (orderData.length !== 0) {
        if (orderData.error === 'false' && orderloading === 'done') {
          setAuthToken(orderData.token);
          setOrderQty(2);
          this.props.history.push('/order');
        } else {
          if (orderData.logoutUser === 'true') {
            signOut();
          }
          this.setState({
            notifDisplay: 'block',
            notification: orderData.errorMessage
          });
        }
      };

      // USER DATA
      if (userData.length !== 0) {
        if (userData.error === 'false' && userloading === 'done') {
          this.genericState(userData.data[0]);
        } else {
          this.setState({
            notifDisplay: 'block',
            notification: userData.errorMessage
          });
        }
      };
    };
  };

  render() {
    const { quantity, price, email, transportFee, lastName, firstName, fullName, total, notification, phone, address, latLng, stateCountry, notifDisplay } = this.state;
    // console.log(latLng)
    return (
      <React.Fragment>
        <Row>
          <div className="order_content">
            <div className="bag">
              <p className="bag-head">Review order &nbsp; - {quantity} item</p>
            </div>
            <div className="summary_inline">
              <div className="summary_type summary_h1">
                Order
              </div>
              <div className="summary_detail">
                <span className="summary_h1">Waste Bag Pickup</span>
                {/* <p className="summary_muted">Order code: SS022592000</p><br /> */}
                <p className="blur">Bag size: 0.5m x 0.5m</p><br />
                <span className="h2">Quantity:</span>
                <span className="h2"> &#10799;{quantity}</span>
              </div>
            </div>
            <span className="hr"></span>
            <div className="summary_inline">
              <div className="summary_type summary_h1">
                Pickup <span style={{ color: '#20a8d8' }}>@</span>
              </div>
              <div className="summary_detail">
                <span className="h2">{fullName}</span>
                <span className="summary_text">{address}</span>
                <span className="summary_text">{stateCountry}</span><br />
                <span className="h2">{phone}</span>
                <span className="hr"></span>
                <Link to={{
                  pathname: "/account/address",
                  data: {
                    address,
                    latLng,
                    phone,
                    "turnOn": false
                  }
                }} key={latLng}><Button className="mr-1 change_address"><span className="uppercase">change address</span></Button></Link>
              </div>
            </div>
            <div className="bag-total">
              <div className="subtotal">
                <p className="small">Sub-total:</p>
                <p className="small">₦{price}.00</p>
              </div>
              <div className="delivery">
                <p className="small">Pickup (Standard - 8 working days):</p>
                <p className="small">₦{transportFee}</p>
              </div>
              <hr />
              <div className="total">
                <h3>Total:</h3>
                <h3>₦{total}.00</h3>
              </div>
              <PayStack data={{ email, lastName, firstName, total, "saveOrder": this.saveOrder, "button": ['btn-go-checkout','fa fa-lock','PAY',false] }} />
            </div>
          </div>
          <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData,
    orderData: state.orderData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendFetchData: (data) => dispatch(sendFetchAccountData(data)),
    sendOrderData: (data) => dispatch(sendFetchOrderData(data))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Summary);