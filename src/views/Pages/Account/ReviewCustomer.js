import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { sendAdminData } from '../../../store/actions/admin';
import { withRouter } from 'react-router-dom';
import { Row, InputGroup, InputGroupText, Input, InputGroupAddon } from 'reactstrap'
import { getAuthUserAll, getAuthUserType } from '../../../services/Auth'
import { dateConstructor } from '../../../utils/utilityFunction'


export class ReviewCustomer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            emailFinder: '',
            adminList: [],
            adminListToDisplay: [],
            notification: '',
            notifDisplay: 'none',
        }
        this.close = this.close.bind(this);
        this.changeState = this.changeState.bind(this);
        this.genericState = this.genericState.bind(this);
        this.sendMeto = this.sendMeto.bind(this);
        this.genericFind = this.genericFind.bind(this);
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

    genericFind(e) {
        const list = this.state.adminList.filter(customer => customer.email.toLowerCase().indexOf(e.target.value.toLowerCase()) === 0);
        this.changeState({
            adminListToDisplay: list,
            emailFinder: e.target.value
        });
    }

    genericState(data) {
        const list = data.filter(customer => customer.user_type === 'customer');
        this.changeState({
            adminListToDisplay: list,
            adminList: list
        });
    }

    sendMeto(data) {
        const { id, state, phone, name, user_type, status, email, image } = data;
        this.props.history.push({
            pathname: '/account/edit',
            data: {
                id,
                state,
                phone,
                name,
                user_type,
                status,
                email,
                image
            }
        });
    }
    

    componentDidMount() {
        const data = JSON.stringify({ "accountID": 'all', ...getAuthUserAll()});
        const { sendAdminData, adminData } = this.props
        let formData = new FormData();
        formData.append('request', 'get_user');
        formData.append('user_type', getAuthUserType());
        formData.append('data', encodeURIComponent(data));
        if (adminData.adminData.length === 0) {
            sendAdminData(formData);
        } else if (adminData.adminData.data !== undefined && adminData.adminData.error === 'false') {
            this.genericState(adminData.adminData.data);
        }
    }

    componentDidUpdate(prevProps) {
        const { adminData, error } = this.props.adminData;
        if (this.props !== prevProps) {
            if (adminData.length !== 0) {
                if (adminData.error === 'true') {
                    this.changeState({
                        notifDisplay: 'block',
                        notification: adminData.errorMessage
                    });
                } else {
                    this.genericState(adminData.data);
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
        const { notification, notifDisplay, adminListToDisplay, emailFinder } = this.state;
        let { error, adminData } = this.props.adminData;
        let adminDisplay;
        if (adminData.length === 0 && error !== 'true') {
            adminDisplay = <div className="loader_con"><div id="big_loader"></div></div>;
        } else {
            adminDisplay = <table className="table table-striped table-hover table-outline">
                <thead className="">
                    <tr>
                        <th className="text-center" style={{ width: '3em' }} ><span role="img" aria-label="people">&#128101;</span></th>
                        <th >User</th>
                        <th className="" >Role</th>
                        <th className="" style={{ width: '3em' }} >Status</th>
                    </tr>
                </thead>
                <tbody>
                    {adminListToDisplay && adminListToDisplay.map((list, index) => {
                        const { id, state, phone,name, regDate, user_type, status, email, image } = list;
                        const { day, month, year } = dateConstructor(regDate);
                        return (
                            <tr key={index+1}>
                                <td className="text-center" >
                                    <div className="c-avatar" >
                                        <img className="table_image" src={image} alt="user_image" />
                                    </div>
                                </td>
                                <td >
                                  <div onClick={() => this.sendMeto({
                                        id, state, phone, name, user_type, status, email, image
                                    })}>
                                    <div>{name}</div>
                                    <div className="small text-muted">{email.substring(0,15)+'...'}</div>
                                    <div className="small text-muted">
                                        Reg: {month+' '+day+' '+year}
                                    </div>
                                  </div>
                                </td>
                                <td >
                                    <span>{user_type}</span>
                                </td>
                                <td >
                                    <span className="confirmed">{status}</span>
                                </td>
                            </tr>
                        )
                    })}

                </tbody>
            </table>
        }
        return (
            <Row>
                <InputGroup className="input-prepend justify-content-end" style={{ marginBottom: '2em' }}>
                    <Input className="people_search" type="text" value={emailFinder} onChange={this.genericFind} placeholder="Who are you looking for?" />
                    <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                            <i className="fa fa-search"></i>
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                {adminDisplay}
                <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="notification" onClick={this.close}>&#x274E;</span> </div>
            </Row>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        adminData: state.adminData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        sendAdminData: (data) => dispatch(sendAdminData(data))
    };
};

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(ReviewCustomer);