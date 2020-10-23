import React, { Component } from 'react';
import { Row } from 'reactstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getAuthUserAll, getAuthUserType } from '../../services/Auth';
import { sendFetchOrderData } from '../../store/actions/order';
import { dateConstructor } from '../../utils/utilityFunction'

class History extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notification: '',
      notifDisplay: 'none',
    }
    this.close = this.close.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  close() {
    this.setState({
      notifDisplay: 'none',
      notification: '',
    });
  }

  changeState(object) {
    this.setState(object);
  }

  componentDidMount() {
    const data = JSON.stringify(getAuthUserAll());
    const { sendOrderData, orderData } = this.props
    if (orderData.orderData.length === 0) {
      let formData = new FormData();
      formData.append('request', 'get_order_history');
      formData.append('user_type', getAuthUserType());
      formData.append('data', encodeURIComponent(data));
      sendOrderData(formData);
    }
  }

  componentDidUpdate(prevProps) {
    const { orderData, error } = this.props.orderData;
    if (this.props !== prevProps) {
      // ORDER DATA
      if (orderData.length !== 0) {
        if (orderData.error === 'true') {
          this.changeState({
            notifDisplay: 'block',
            notification: orderData.errorMessage
          });
        }
      } else {
        if (error === 'true') {
          this.changeState({
            notifDisplay: 'block',
            notification: 'Please refresh or try again later'
          });
        }
      }
    };
  };


  render() {
    const { notifDisplay, notification } = this.state
    const { error, orderData } = this.props.orderData;
    let historyList;
    if (orderData.length === 0 && error !== 'true') {
      historyList = <div className="loader_con"><div id="big_loader"></div></div>;
    } else {
      historyList = <div className="timeline">
        {orderData.data && orderData.data.sort((a, b) => {
          return a.iorderDate - b.orderDate;
        }).map(order => {
          let date = dateConstructor(order.orderDate * 1);
          let status = order.status;
          if (status === 'pending') {
            status = <div className="update">
              <span className="pending">PENDING</span>
            </div>;
          } else if (status === 'accepted') {
            status = <div className="update">
              <span className="accepted">ACCEPTED</span>
            </div>;
          } else {
            status = <div className="update">
              <span className="confirmed" role="img" aria-label="confirmed">SUCCESSFUL</span>
            </div>;
          }
          return (
            <div className="history_box" key={order.id}>
              <div className="history_date">
                <span className="hour">{date.hour}:{date.minute} {date.ampm} </span>
                <span className="month">{date.day} {date.month} {date.shortYear}</span>
              </div>
              <div className="activity">
                <div className="title">
                  Ordered for waste disposal
                  </div>
                <div className="description">
                  Quantity: {order.orderQty} bag(s).
                  </div>
                {status}
              </div>
            </div>
          )
        })}
      </div>;
    }

    return (
      <React.Fragment>
        <Row>
          <div className="history">
            {historyList}
            <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
          </div>
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orderData: state.orderData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendOrderData: (data) => dispatch(sendFetchOrderData(data))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(History);