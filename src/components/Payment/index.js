import React from 'react';
import creditcard from '../../assets/creditcard.png';
import date from '../../assets/date.png';
import coin from '../../assets/coins.png';
import locked from '../../assets/locked.png';

import { Input } from 'reactstrap';

class Payment extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      cardNumber: '',
      noSpaceCardNumber: '',
      expiryDate: '',
      amount: '',
      amountWithoutComma: '',
      cvs: ''
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    let val = e.target.value.replace(/\D/g, '');
    switch (e.target.id) {
      case 'cardNumber':
        let addSpace = val.replace(/(.{4})/g, '$1 ').trim();
        let noSpace = addSpace.replace(/ /g, '');
        this.setState(
          {
            cardNumber: addSpace,
            noSpaceCardNumber: noSpace
          }
        );
        break;
      case 'expiryDate':
        let slashed = val.replace(/(.{2})/, '$1/').trim();
        this.setState(
          {
            expiryDate: slashed
          }
        );
        break;
      case 'amount':
        let comma = val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.setState(
          {
            amount: comma,
            amountWithoutComma: val
          }
        );
        break;
      default:
        this.setState(
          {
            [e.target.id]: val
          }
        );
        break;
    }
  }

      // {/* <span className="hr"></span>
      //       <div className="summary_pay">
      //         <label htmlFor="toggle" className="toggle_label"> Pay with credit <span style={{ color: '#f0ad4e' }}>Card</span> ▼</label>
      //         <input type="checkbox" id="toggle" className="toggle" />
      //         <div className="community_container">
      //           <PayStack info={{ view: 'community', id: 12 }} />
      //           ??????????USE CASES?????????
      //         </div>
      //       </div> */}

  render() {
    // let info = this.props.info;
    let { cardNumber, expiryDate, cvs, amount } = this.state;
    return (
      < React.Fragment >
        <form className="" action="" method="post" id="card_payment_form">
          <div className="payment_form">
            <div className="cardNumber">
              <label htmlFor="cardNumber">Card Number</label><br />
              <span className="icon"> <img src={creditcard} alt="" /> </span>
              <Input id="cardNumber" className="input" type="text" name="" value={cardNumber} pattern="[\d ]*" onChange={this.handleChange} maxLength="24" placeholder=" 0000 - 0000 - 0000 - 0000" required />
            </div>
            <div className="inlineElement">
              <div className="exp">
                <label htmlFor="expiryDate">Expire</label><br />
                <span className="icon"><img src={date} alt="" /> </span>
                <Input id="expiryDate" className="expiry" type="text" name="" value={expiryDate} pattern="[\d/]*" onChange={this.handleChange} maxLength="5" placeholder=" 00/00" required />
              </div>
              <div className="cvs">
                <label htmlFor="cvs">CVC</label><br />
                <span className="icon"><img src={locked} alt="" /> </span>
                <Input id="cvs" className="cv" type="text" name="" value={cvs} pattern="[\d]*" onChange={this.handleChange} maxLength="3" placeholder="000" required />
              </div>
            </div>
            <div className="amountElement">
              <label htmlFor="amount"> Amount (₦) </label><br />
              <span className="icon"><img src={coin} alt="" /> </span>
              <Input id="amount" className="input" type="text" name="" value={amount} pattern="[\d,]*" onChange={this.handleChange} maxLength="20" placeholder="min. ₦200" required />
            </div>
          </div>
        </form>
      </React.Fragment >
    )
  }
}

export default Payment;
