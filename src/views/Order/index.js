import React, { Component } from 'react';
// import Dashboard from '../Dashboard'
import { Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import bag from '../../assets/garbage_bag.jpg';
import { getOrderQty, setOrderQty } from '../../services/Auth';
// import { isAuthEmail, authenticateUser, isAuthUserType } from '../../services/Auth'

class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: 2,
      price: 400,
      transportFee: 100,
      total: 500,
      notification: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    e.preventDefault();
    let Qty;
    const { quantity } = this.state;
    switch (e.target.id) {
      case 'minus':
        if (quantity > 2) {
          Qty = quantity - 1;
          setOrderQty(Qty);
          this.setState({
            quantity: Qty,
            price: Qty * 200,
            transportFee: Qty * 50,
            total: (Qty * 50) + (Qty * 200)
          });
        } else {
          this.setState({
            notification: 'Minimum order recieved'
          });
        }
        break;
      case 'plus':
        if (quantity < 30) {
          Qty = quantity + 1;
          setOrderQty(Qty);
          this.setState({
            quantity: Qty,
            price: Qty * 200,
            transportFee: Qty * 50,
            total: (Qty * 50) + (Qty * 200)
          });
        } else {
          this.setState({
            notification: 'Maximum order recieved'
          });
        }
        break;
      default:
        setOrderQty(2);
        this.setState({
          quantity: 2,
          price: 400,
          transportFee: 100,
          total: 500,
          notification: ''
        });
        break;
    }
  }

componentDidMount() {
  if (getOrderQty()) {
    this.setState({
      quantity: getOrderQty()*1,
      price: getOrderQty() * 200,
      transportFee: getOrderQty() * 50,
      total: (getOrderQty() * 50) + (getOrderQty() * 200)
    });
  } else {
    setOrderQty(2);
  }


};


render() {
  const { quantity, price, transportFee, total } = this.state;
  return (
    <React.Fragment>
      <Row>
        <div className="order_content">
          <div className="bag">
            <p className="bag-head"><span className="uppercase">Your Bag</span> - {quantity} item</p>
          </div>
          <div className="bag-product">
            <div className="image">
              <img src={bag} className="product-image" alt="waste bag" />
            </div>
            <div className="description">
              {/* <p className="muted">Order code: SS022592000</p> */}
              <br />
              <span className="invinsible_hr"></span>
              <span className="h1">Waste Bag Pickup</span>
              <p className="blur">Type: Standard plastic bag</p>
              <p className="description-text">Select quantity according to plastic bag in description.</p>
              <p className="blur">Bag size: 0.5m x 0.5m</p>
              <span className="h1">₦{price}.00</span>
              <div className="quantity-wrapper">
                <div className="increase_wrapper">
                  <span className="incremento">
                    <button type="button" name="button" id="minus" onClick={this.handleChange} className="but"><span id="minus" role="img" aria-label="minus"> &#10134;</span></button>
                    <label htmlFor="quantity"></label>
                    <span className="quantity">{quantity}</span>
                    {/* <Input type="text" id="quantity" maxLength="3" value={'100'} name="location" className="quantity" /> */}
                    <button type="button" name="button" id="plus" onClick={this.handleChange} className="but"><span id="plus" role="img" aria-label="plus"> &#10133;</span></button>
                  </span>
                </div>
                <button id="del" className="btn-remove uppercase" onClick={this.handleChange}><span id="del" role="img" aria-label="del">&#128465; del</span></button>
              </div>
            </div>
          </div>
          <div className="bag-total">
            <div className="subtotal">
              <p className="">Subtotal:</p>
              <p className="">₦{price}.00</p>
            </div>
            <div className="delivery">
              <p className="">Pickup in (8 working days):</p>
              <p className="">₦{transportFee}.00</p>
            </div>
            <hr />
            <div className="total">
              <h3>Total:</h3>
              <h3>₦{total}.00</h3>
            </div>
            <Link to="/order/summary"><button className="btn-go-checkout uppercase"> Checkout</button></Link>
          </div>
        </div>
      </Row>

    </React.Fragment>
  )
}
}

export default Order;