import React, { Component } from 'react'
import { Row } from 'reactstrap'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getAuthUserAll, getAuthUserType, getAuthLatLng } from '../../services/Auth';
import { sendFetchOrderData } from '../../store/actions/order';
import { htmlspecialchars_decode, dateConstructor } from '../../utils/utilityFunction'
import { withRouter } from 'react-router-dom';

export class Pending extends Component {
    constructor(props) {
        super(props)

        this.state = {
            orderList: [],
            notification: '',
            notifDisplay: 'none',
        }

        this.close = this.close.bind(this);
        this.changeState = this.changeState.bind(this);
        this.sendMeto = this.sendMeto.bind(this);
        this.genericState = this.genericState.bind(this);
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

    sendMeto(data) {
        const { personOf, email, phone, pickupAddress, pickupStateCountry, latLng } = data;
        const defaultLatLng = JSON.parse(getAuthLatLng());
        const route = JSON.parse(htmlspecialchars_decode(latLng));
        this.props.history.push({
            pathname: '/pickups/map',
            data: {
                personOf,
                email,
                phone,
                pickupAddress,
                pickupStateCountry,
                defaultLatLng,
                route
            }
        });
    }

    genericState(data) {
        const orders = data.filter(order => order.status === 'accepted');
        this.changeState({
            orderList: orders
        });
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
        } else if (orderData.orderData.data !== undefined) {
            this.genericState(orderData.orderData.data);
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
                } else {
                    this.genericState(orderData.data);
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
        let { notification, notifDisplay, orderList } = this.state;
        let { error, orderData } = this.props.orderData;
        let OrderDisplay;
        if (orderData.length === 0 && error !== 'true') {
            OrderDisplay = <div className="loader_con"><div id="big_loader"></div></div>;
        } else {
            OrderDisplay = <table className="table table-hover table-outline">
                <thead className="thead-light">
                    <tr>
                        <th className="text-center" style={{ width: '4em' }}>No.</th>
                        <th>Address</th>
                        <th className="" style={{ width: '5em' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {orderList && orderList.map((order, index) => {
                        const { personOf, email, orderDate, phone, pickupAddress, pickupStateCountry, latLng } = order;
                        const { day, month, year } = dateConstructor(orderDate);
                        return (
                            <tr key={index}>
                                <td className="text-center" >
                                {index + 1}.
                        </td>
                                <td >
                                    <div id="1" className="tableAnchor" onClick={() => this.sendMeto({
                                        personOf, email, phone, pickupAddress, pickupStateCountry, latLng
                                    })}>
                                        <div className="table_address">{pickupAddress}</div>
                                        <span className="table_name">{personOf}</span>
                                    </div>
                                    <div className="table_small_older">
                                        <a href={"mailto:" + email} className="table_email">
                                        {email}
                                </a>
                                        <a href={"tel:" + phone} className="table_number">
                                        {phone}
                                </a>
                                    </div>
                                </td>
                                <td>
                                    <span className="table_date">{month+', '+day+' '+year}</span>
                                    <div className="accepted">Pickup</div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        }



        return (
            <Row>
                {OrderDisplay}
                <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
                {/* <table className="table table-hover table-outline">
                    <thead className="thead-light">
                        <tr>
                            <th className="text-center" style={{ width: '4em' }}>No.</th>
                            <th>Address</th>
                            <th className="" style={{ width: '5em' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center" >
                                1.
                            </td>
                            <td >
                                <div id="1" className="tableAnchor" onClick={() => this.sendMeto({})}>
                                    <div className="table_address">Omolayo Pry School, Oba Ile, Akure, Ondo State</div>
                                    <span className="table_name">Fashanu Tosin</span>
                                </div>
                                <div className="table_small_older">
                                    <a href="mailto:fashanutosin7@gmail.com" className="table_email">
                                        fashanutosin7@gmail.com
                                    </a>
                                    <a href="tel:09036723177" className="table_number">
                                        09036723177
                                    </a>
                                </div>
                            </td>
                            <td>
                                <span className="table_date">July, 21 2020</span>
                                <div className="accepted">Pickup</div>
                            </td>
                        </tr>
                    </tbody>
                </table> */}
            </Row>
        )
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
)(Pending);