import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { sendAdminData } from '../../../store/actions/admin';
import { withRouter } from 'react-router-dom';
import { Row, Col, Input } from 'reactstrap'
import { getAuthUserAll, getAuthUserType, setAuthToken, signOut } from '../../../services/Auth'

export class Editor extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: '',
            image: '',
            name: '',
            user: '',
            state: '',
            propStatus: '',
            propEmail: '',
            propPhone: '',
            newStatus: '',
            newEmail: '',
            newPhone: '',
            notifDisplay: 'none',
            notification: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.close = this.close.bind(this);
    }

    close() {
        this.setState({
            notifDisplay: 'none',
            notification: '',
        });
    }


    handleChange(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        let sendTo;
        const { sendAdminData } = this.props
        const { id, propEmail, name, newEmail, newPhone, newStatus } = this.state;
        if (propEmail.trim() !== newEmail.trim()) {
            sendTo = 'phone';
        } else {
            sendTo = 'email';
        }
        const data = JSON.stringify({ "accountID": id, "accountName": name, sendTo, "email": newEmail, "phone": newPhone, "status": newStatus, ...getAuthUserAll() });
        let formData = new FormData();
        formData.append('request', 'admin_edit_account');
        formData.append('user_type', getAuthUserType());
        formData.append('data', encodeURIComponent(data));
        sendAdminData(formData);
        //   console.log(this.state)
    }

    componentDidMount() {
        if (this.props.location.data === undefined) {
            this.props.history.push('/customer/');
        } else {
            const { id, state, phone, name, user_type, status, email, image } = this.props.location.data;
            this.setState({
                id,
                image,
                name,
                user_type,
                state,
                propStatus: status,
                propEmail: email,
                propPhone: phone,
                newStatus: status,
                newEmail: email,
                newPhone: phone
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            const { loading, adminData } = this.props.adminData;
            if (adminData.length !== 0) {
                if (adminData.error === 'false' && loading === 'done' && adminData.submitted === 'true') {
                    setAuthToken(adminData.token);
                    this.props.history.goBack();
                } else {
                    if (adminData.logoutUser === 'true') {
                        signOut();
                    }
                    this.setState({
                        notifDisplay: 'block',
                        notification: adminData.errorMessage
                    });
                }
            };
        };
    };



    render() {
        let buttonText = 'SAVE';
        const { loading } = this.props.adminData;
        if (loading === 'done') {
            buttonText = 'SAVE';
        } else if (loading === 'true') {
            buttonText = <div id="loader"></div>;
        }
        const { name, image, user_type, state, newEmail, newPhone, newStatus, notifDisplay, notification } = this.state;
        return (
            <div className="order_content">
                <div style={{ position: 'relative', width: '10em', margin: '0em auto 2em auto' }} className="community_container">
                    <img src={image} alt="" style={{ width: '10em', borderRadius: '50%', border: '2px solid  #20a8d8' }} />
                </div>
                <span className="bag-head"></span><br />
                <form encType="multipart/form-data" method="post" onSubmit={this.handleSubmit} >
                    <Row>
                        <Col sm="6">
                            <h3>Name</h3>
                            <h5><span role="img" aria-label="name">&#128100;</span> &nbsp; {name}</h5>
                        </Col>
                        <Col sm="6">
                            <h3>User</h3>
                            <h5><span role="img" aria-label="name">&#128100;</span> &nbsp; {user_type}</h5>
                        </Col>
                    </Row><br />
                    <Row>
                        <Col sm="6">
                            <h3>Status</h3>
                            <Input type="select" id="newStatus" onChange={this.handleChange} value={newStatus}>
                                <option>active</option>
                                <option>pending</option>
                                <option>inactive</option>
                            </Input>
                        </Col>
                        <Col sm="6">
                            <h3>Email</h3>
                            <Input type="text" id="newEmail" onChange={this.handleChange} value={newEmail} style={{ border: '1px solid lightgrey' }} required />
                        </Col>
                    </Row><br />
                    <Row>
                        <Col sm="6">
                            <h3>State</h3>
                            <h5><span role="img" aria-label="name">&#128100;</span> &nbsp; {state}</h5>
                        </Col>
                        <Col sm="6">
                            <h3>Phone</h3>
                            <Input type="number" id="newPhone" onChange={this.handleChange} value={newPhone} style={{ border: '1px solid lightgrey' }} required />
                        </Col>
                    </Row><br />
                    <button type="submit" className="btn-go-checkout">{buttonText}</button>
                </form>
                <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
            </div>
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
)(Editor);