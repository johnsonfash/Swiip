import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { Button, Input, Row, Modal, ModalBody, ModalFooter, ModalHeader, FormGroup, Label } from 'reactstrap';
import { setAuthToken, getAuthUserType, getAuthUserAll, setAuthImage, getAuthName, setAuthName, signOut } from '../../../services/Auth';
import { sendFetchAccountData } from '../../../store/actions/user';

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
      file: [],
      name: '',
      gender: '',
      birthday: '',
      latLng: '',
      phone: '',
      email: '',
      oldPassword: '',
      newPassword: '',
      address: '',
      imagePreviewUrl: '',
      notification: '',
      notifDisplay: 'none',
      modal: false
    }
    this.close = this.close.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fileRef = React.createRef();
    this.changeState = this.changeState.bind(this);
    this.commonState = this.commonState.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      oldPassword: '',
      newPassword: ''
    });
  }

  close() {
    this.setState({
      notifDisplay: 'none',
      notification: '',
    });
  }

  commonState(data) {
    const { name, gender, birthday, phone, email, defaultAddress, defaultLatLng, image } = data;
    this.changeState({
      name: name.trim(),
      demoName: name.trim(),
      gender: gender,
      demoGender: gender,
      birthday: birthday,
      demoBirthday: birthday,
      phone: phone,
      latLng: defaultLatLng,
      email: email,
      address: defaultAddress.trim(),
      imagePreviewUrl: image.trim(),
      prevImage: image.trim(),
      modal: false
    });
  }

  changeState(object) {
    this.setState(object);
  }

  handleFileChange(e) {
    let file = e.target.files[0];
    let picReader = new FileReader();
    console.log(file)
    picReader.onloadend = () => {
      this.changeState({
        file: file,
        imagePreviewUrl: picReader.result
      });
    };
    picReader.readAsDataURL(file);
  }

  handleChange(e) {
    if (e.target.id === 'oldPassword' || e.target.id === 'newPassword') {
      /[^A-Za-z\d@_*#$]+/.test(e.target.value) ? (
        this.changeState({
          notifDisplay: 'block',
          notification: 'Only Alphanumeric and @_*#$ symbols are allowed'
        })
      ) : (
          this.changeState(
            {
              [e.target.id]: e.target.value
            }
          )
        )
    } else {
      this.changeState(
        {
          [e.target.id]: e.target.value
        }
      );
    }
  }


  handleSubmit(e) {
    e.preventDefault();
    let { sendFetchData } = this.props;
    const { name, demoName, gender, demoGender, birthday, demoBirthday, file, oldPassword, newPassword } = this.state;
    if (name.trim().split(/ (.+)/)[1] === undefined) {
      this.changeState({
        notifDisplay: 'block',
        notification: 'Please add your Surname - Space - Name'
      });
    } else if (demoName === name && demoBirthday === birthday && demoGender === gender && oldPassword === '' && file.length === 0) {
      this.changeState({
        notifDisplay: 'block',
        notification: 'Please make some changes to submit'
      });
    } else if (oldPassword !== '' && (oldPassword.length < 8 || newPassword.length < 8)) {
      this.changeState({
        notifDisplay: 'block',
        notification: 'Password must be (8) characters or more'
      });
    } else if (oldPassword !== '' && (oldPassword === newPassword)) {
      this.changeState({
        notifDisplay: 'block',
        notification: 'Sorry you entered an old password'
      });
    } else {
      let data = JSON.stringify({ name, gender, birthday, oldPassword, newPassword, ...getAuthUserAll() });
      let formData = new FormData();
      formData.append('request', 'edit_account');
      formData.append('user_type', getAuthUserType());
      formData.append('file', file);
      formData.append('data', encodeURIComponent(data));
      sendFetchData(formData);
    }
  }

  componentDidMount() {
    const data = JSON.stringify({ ...getAuthUserAll() });
    const { sendFetchData, userData } = this.props;
    if (userData.userData.length === 0) {
      let formData = new FormData();
      formData.append('request', 'get_user');
      formData.append('user_type', getAuthUserType());
      formData.append('data', encodeURIComponent(data));
      sendFetchData(formData);
    } else {
      this.commonState(userData.userData.data[0]);
    }
  }

  componentDidUpdate(prevProps) {
    const { errorMessage, error, userloading, userData } = this.props.userData;
    if (this.props !== prevProps) {
      if (userData.length !== 0) {
        if (userData.error === 'false' && userloading === 'done') {
          this.commonState(userData.data[0]);
          if (userData.submitted === 'true') {
            if (userData.data[0].name !== getAuthName()) {
              setAuthName(userData.data[0].name)
            }
            setAuthToken(userData.data[0].token);
            if (userData.data[0].image !== this.state.prevImage) {
              setAuthImage(userData.data[0].image);
            }
            this.changeState({
              notifDisplay: 'block',
              notification: userData.message
            });
          }
        } else if (userData.error === 'true') {
          if (userData.logoutUser === 'true') {
            signOut();
          }
          if (userData.data[0].token !== undefined) {
            setAuthToken(userData.data[0].token);
          }
          this.changeState({
            notifDisplay: 'block',
            notification: userData.errorMessage
          });
        }
      } else if (error === 'true') {
        this.changeState({
          notifDisplay: 'block',
          notification: errorMessage
        });
      }
    };
  };

  render() {
    let buttonText = 'SAVE';
    let passwordButton = 'SAVE';
    let displayData;
    const { imagePreviewUrl, name, address, phone, email, gender, birthday, notifDisplay, latLng, notification, oldPassword, newPassword } = this.state;
    const { userloading, userData, error } = this.props.userData;
    if (userloading === 'done') {
      buttonText = 'SAVE';
      passwordButton = 'SAVE';
    } else {
      if (userloading === 'true' && oldPassword === '')
        buttonText = <div id="loader"></div>;
      else
        passwordButton = <div id="loader"></div>;
    }

    if (userData.length === 0 && error !== 'true') {
      displayData = <div className="loader_con"><div id="big_loader"></div></div>;
    } else {
      displayData = <div className="order_content">
        <form encType="multipart/form-data" method="post" onSubmit={this.handleSubmit} >
          <div style={{ position: 'relative', width: '18em', margin: '0em auto 2em auto' }} className="community_container">
            <label htmlFor="file" className="file_label" style={{ height: '20em', border: '2px solid #20a8d8', borderRadius: '20%' }}>
              <img src={imagePreviewUrl} alt="" style={{ height: '20em' }} />
              <div className="bar_upload">
                <span className="upload_icon straight" style={{ width: '3em' }}></span>
                <span className="upload_icon slanting" style={{ width: '3em' }}></span>
                <span className="upload_icon round"></span>
              </div>
            </label>
            <input type="file" id="file" name="file" className="file" accept="image/*" onChange={this.handleFileChange} ref={this.fileRef} />
          </div>
          <span className="bag-head"></span>
          <div className="summary_inline">
            <div className="account_icon" >
              <span role="img" aria-label="name">&#128199;</span>
            </div>
            <div className="account_detail">
              <span className="h2">Name</span><br /><br />
              <Input type="text" id="name" style={{ color: 'black' }} value={name} onChange={this.handleChange} placeholder="Surname - Space - Name" autoComplete="name" required />
            </div>
          </div>
          <span className="hr"></span>
          <div className="summary_inline">
            <div className="account_icon">
              <span role="img" aria-label="address">&#9873;</span>
            </div>
            <div className="account_detail">
              <span className="h2">Address</span>
              <span className="summary_text">{address}</span><br />
              <span className="h2"><span role="img" aria-label="name">&#9742;</span> {phone}</span>
              <span className="hr"></span>
              <Link to={{
                pathname: "/account/address",
                data: {
                  address,
                  latLng,
                  phone,
                  "turnOn": true
                }
              }} key={latLng}><Button className="mr-1 change_address">CHANGE</Button></Link>
            </div>
          </div>
          <span className="hr"></span>
          <div className="summary_inline">
            <div className="account_icon">
              <span role="img" aria-label="email">&#9993;</span>
            </div>
            <div className="account_detail">
              <span className="h2">Email</span>
              <span className="summary_text">{email}</span>
              <span className="hr"></span>
              <Button onClick={this.toggle} className="mr-1">CHANGE PASSWORD</Button>
            </div>
          </div>
          <span className="hr"></span>
          <div className="summary_inline">
            <div className="account_icon">
              <span role="img" aria-label="gender">&#9892;</span>
            </div>
            <div className="account_detail">
              <div className="personal_wrapper">
                <div className="personal_one">
                  <span className="h2">Gender</span><br /><br />
                  <Input type="select" id="gender" value={gender} onChange={this.handleChange} required>
                    <option>Male</option>
                    <option>Female</option>
                  </Input>
                </div>
                <span style={{ width: '5%' }}></span>
                <div className="personal_two">
                  <span className="h2">Birthday</span><br /><br />
                  <Input type="date" id="birthday" value={birthday} onChange={this.handleChange} max="2030-12-30" min="1930-01-01" placeholder="yyyy-mm-dd" required />
                </div>
              </div>
            </div>
          </div>
          <button type="submit" className="btn-go-checkout">{buttonText}</button>
        </form>
        <Modal isOpen={this.state.modal} toggle={this.toggle}
          className={'modal-primary ' + this.props.className}>
          <ModalHeader toggle={this.toggle}>Change Password</ModalHeader>
          <form method="post" onSubmit={this.handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input type="text" id="oldPassword" value={oldPassword} onChange={this.handleChange} placeholder="Enter your old password" required autoComplete="off" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="newPassword">New Password</Label>
                <Input type="text" id="newPassword" value={newPassword} onChange={this.handleChange} placeholder="Enter your new password" required autoComplete="off" />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" type="submit" style={{ width: '100%' }}>{passwordButton}</Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>;
    }
    return (
      <React.Fragment>
        <Row>
          {displayData}
          <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
        </Row>

      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendFetchData: (data) => dispatch(sendFetchAccountData(data))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Account);