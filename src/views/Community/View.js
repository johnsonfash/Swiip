import React, { Component } from 'react';
// import Dashboard from '../Dashboard'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Row, Progress, Input } from 'reactstrap';
import { sendCommunityData } from '../../store/actions/community';
import PayStack from '../../components/Payment/PayStack';
import draftToHtml from 'draftjs-to-html';
import { getAuthUserType, getAuthUserAll, setAuthToken, signOut } from '../../services/Auth';
import { Link } from 'react-router-dom';
import { htmlspecialchars_decode, StringToJSX, dateConstructor } from '../../utils/utilityFunction'
import Page404 from '../Pages/Page404';

class View extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      notification: '',
      notifDisplay: 'none',
      total: '',
      dontShow: true,
      commData: []
    }
    this.close = this.close.bind(this);
    this.changeState = this.changeState.bind(this);
    this.deleting = this.deleting.bind(this);
    this.saveOrder = this.saveOrder.bind(this);
    this.handleChange = this.handleChange.bind(this);
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

  saveOrder(donateRef) {
    const id = this.props.match.params.id * 1;
    const { email, total } = this.state;
    const { sendCommData } = this.props;
    const json = JSON.stringify({
      "commID": id, email, donateRef, "amount": total, ...getAuthUserAll()
    });
    let formData = new FormData();
    formData.append('request', 'donate_comm');
    formData.append('user_type', getAuthUserType());
    formData.append('data', encodeURIComponent(json));
    sendCommData(formData);
  }

  handleChange(e) {
    if (e.target.value * 1 >= 200) {
      this.changeState({
        total: e.target.value,
        dontShow: false
      });
    } else {
      this.changeState({
        total: e.target.value,
        dontShow: true
      });
    }
  }


  componentDidMount() {
    const id = this.props.match.params.id * 1;
    const { sendCommData, communityData } = this.props
    if (!isNaN(id)) {
      let nameExplode = getAuthUserAll().name.trim().split(/ (.+)/);
      if (nameExplode[1] === undefined) {
        nameExplode[1] = nameExplode[0];
      }
      this.changeState({ lastName: nameExplode[0], firstName: nameExplode[1], email: getAuthUserAll().findBy })
      if (communityData.communityData.length === 0) {
        const data = JSON.stringify(getAuthUserAll());
        if (communityData.communityData.length === 0) {
          let formData = new FormData();
          formData.append('request', 'get_comm_list');
          formData.append('user_type', getAuthUserType());
          formData.append('data', encodeURIComponent(data));
          sendCommData(formData);
        }
      } else {
        this.changeState({
          commData: [communityData.communityData.data.find(comm => comm.id === id)]
        });
      }
    };
  }


  componentDidUpdate(prevProps) {
    const id = this.props.match.params.id * 1;
    const { communityData, error } = this.props.communityData;
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
          if ( communityData.message === 'Donate success' ) {
            this.changeState({
              total: '',
              notifDisplay: 'block',
              notification: communityData.message
            });
          } else {
            this.props.history.push('/community');
          }
        } else {
          this.changeState({
            commData: [communityData.data.find(comm => comm.id === id)]
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
    let { notification, notifDisplay, commData, email, firstName, lastName, total, dontShow } = this.state;
    let id = this.props.match.params.id * 1;
    let { error, communityData } = this.props.communityData;
    let pageDisplay;
    let button;

    switch (getAuthUserType()) {
      case 'customer':
        button = (id) => (
          <div className="btn_view">
            <Input type="number" style={{ border: '1px solid grey', marginRight: '0.5em', fontWeight: '600' }} id="amount" value={total} onChange={this.handleChange} placeholder=" min. ₦200" autoComplete="off" />
            <PayStack data={{
              email, lastName, firstName, total, "saveOrder": this.saveOrder,
              "button": ['btn_donate btn delete', '', 'Donate', dontShow]
            }} />
          </div>
        );
        break;
      case 'admin':
        button = (id) => (<div className="btn_view">
          <button className="delete btn" onClick={() => this.deleting(id)}>Delete</button> &nbsp;&nbsp;
          <Link to={'/community/edit/' + id}><button className="edit btn">Edit</button></Link>
        </div>);
        break;
      default:
        button = (id) => (null);
    }

    if (isNaN(id)) {
      pageDisplay = <Page404 />;
    } else {
      if (communityData.length === 0 && error !== 'true') {
        pageDisplay = <div className="loader_con"><div id="big_loader"></div></div>;
      } else {
        if (commData[0] === undefined) {
          pageDisplay = <Page404 />;
        } else {
          pageDisplay = <React.Fragment>
            {commData && commData.map(comm => {
              let eachPara = comm.details;
              let color;
              let published = dateConstructor(comm.published);
              let percentage = Math.round((comm.fundGotten / comm.fundNeeded) * 100) + 1;
              percentage > 60 ? ( color = 'success') : ( color = 'red')
              eachPara = draftToHtml(JSON.parse(htmlspecialchars_decode(eachPara)));
              return (
                <Row key={comm.id}>
                  <div className="community_container containerFull">
                    <div className="image">
                      <img src={comm.image} alt="" />
                    </div>
                    <div className="title_big">
                      {comm.location}
                    </div>
                    <hr className="hr" />
                    <div className="details">
                      <div className="detail">
                        <div className="published">
                          Date Pubished
                            </div>
                        <div className="date">
                          {published.day+', '+published.month+' '+published.year}
                            </div>
                      </div>
                      <div className="detail">
                        <div className="amount"> <span>Fund needed:</span> ₦{comm.fundNeeded}</div>
                        <Progress color={color} value={percentage} className="mb-3">{percentage}%</Progress>
                      </div>
                    </div>
                    <div className="text">
                      <StringToJSX domString={eachPara} className="card__text" />
                    </div>
                    {button(comm.id)}
                  </div>
                </Row>
              )
            })}
          </React.Fragment>;
        }
      }
    }


    return (
      <React.Fragment>
        {pageDisplay}
        <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
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
)(View);