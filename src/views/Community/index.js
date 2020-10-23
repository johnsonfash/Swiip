import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { sendCommunityData } from '../../store/actions/community'
import { Card, Col, Row, Progress } from 'reactstrap';
import { Link } from 'react-router-dom'
import { getAuthUserType, getAuthUserAll, setAuthToken, signOut } from '../../services/Auth'
import draftToHtml from 'draftjs-to-html';
import { htmlspecialchars_decode, StringToJSX } from '../../utils/utilityFunction'

class Community extends Component {
  constructor(props) {
    super(props);

    this.state = {
      notification: '',
      notifDisplay: 'none',
    }
    this.close = this.close.bind(this);
    this.changeState = this.changeState.bind(this);
    this.deleting = this.deleting.bind(this);
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
    const { sendCommData, communityData } = this.props
    if (communityData.communityData.length === 0 || communityData.communityData.data.length < 2) {
      const data = JSON.stringify(getAuthUserAll());
      if (communityData.communityData.length === 0) {
        let formData = new FormData();
        formData.append('request', 'get_comm_list');
        formData.append('user_type', getAuthUserType());
        formData.append('data', encodeURIComponent(data));
        sendCommData(formData);
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { error, communityData } = this.props.communityData;
    if (this.props !== prevProps) {
      if (communityData.length !== 0) {
        if (communityData.error === 'true') {
          if (communityData.logoutUser === 'true') {
            signOut();
          }
          this.changeState({
            notifDisplay: 'block',
            notification: communityData.errorMessage
          });
        } else if (communityData.submitted === 'true') {
          setAuthToken(communityData.token);
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

  deleting(id) {
    const { sendCommData } = this.props
    const data = JSON.stringify({ ...getAuthUserAll(), "commID": id });
    let formData = new FormData();
    formData.append('request', 'del_comm');
    formData.append('user_type', getAuthUserType());
    formData.append('data', encodeURIComponent(data));
    sendCommData(formData);
  }


  render() {
    const { notifDisplay, notification } = this.state;
    let { error, communityData } = this.props.communityData;
    let commDisplay;
    let button;
    switch (getAuthUserType()) {
      case 'customer':
        button = (id) => {
          return (<Link to={'/community/' + id}><div className="button">
            <button type="button" name="button" className="btn_donate btn delete">donate</button>
          </div></Link>)
        };
        break;
      case 'admin':
        button = (id) => {
          return (<div className="button">
            <button className="delete btn" onClick={() => this.deleting(id)}>Delete</button>
            <Link to={'/community/edit/' + id}><button className="edit btn">Edit</button></Link>
          </div>)
        };
        break;
      default:
        button = (id) => { return ('') };
        break;
    }

    if (communityData.length === 0 && error !== 'true') {
      commDisplay = <div className="loader_con"><div id="big_loader"></div></div>;;
    } else {
      commDisplay = <Row style={{ overflow: 'hidden', padding: '0' }}>
        {communityData.data && communityData.data.map(comm => {
          let eachPara = comm.details;
          let color;
          let percentage = Math.round((comm.fundGotten / comm.fundNeeded) * 100) + 1;
          percentage > 60 ? ( color = 'success') : ( color = 'red');
          eachPara = draftToHtml(JSON.parse(htmlspecialchars_decode(eachPara)));
          eachPara = eachPara.substring(0, eachPara.indexOf('<', 50)) + '...';
          return (
            <Col xs="12" sm="6" md="4" key={comm.id} style={{ margin: '0 0 30px 0px', padding: '0.5em' }}>
              <Card className="card__item">
                <Link to={'/community/' + comm.id}>
                  <img src={comm.image} alt="" className="card__image" />
                  <div className="card__content">
                    <div className="amount"> <span>Fund needed:</span> ₦{comm.fundNeeded}</div>
                    <Progress color={color} value={percentage} className="mb-3">{percentage}%</Progress>
                    <div className="card__title"> {comm.location} </div>
                    <StringToJSX domString={eachPara} className="card__text" />
                  </div>
                </Link>
                {button(comm.id)}
              </Card>
            </Col>
          )
        })}
      </Row>;

    }

    return (
      <React.Fragment>
        <div className="community_container">
          {commDisplay}
          <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
        </div>
      </React.Fragment>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    communityData: state.communityData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sendCommData: (data) => dispatch(sendCommunityData(data))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Community);