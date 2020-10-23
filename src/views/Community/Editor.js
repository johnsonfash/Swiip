import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Input, Row } from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import htmlToDraft from 'html-to-draftjs';
import { sendCommunityData } from '../../store/actions/community';
import { setAuthToken, getAuthUserAll, getAuthUserType, signOut } from '../../services/Auth';
import { htmlspecialchars_decode } from '../../utils/utilityFunction'


class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: [],
      imagePreviewUrl: '',
      location: '',
      amount: '',
      submitted: 'false',
      notification: '',
      notifDisplay: 'none',
      editorState: EditorState.createEmpty()
    };
    this.close = this.close.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.cleanSlate = this.cleanSlate.bind(this);
    this.updateState = this.updateState.bind(this);
    this.changeState = this.changeState.bind(this);
    this.fileRef = React.createRef();
  }

  close() {
    this.setState({
      notifDisplay: 'none'
    });
  }

  changeState(object) {
    this.setState(object);
  }

  updateState(communityData, id) {
    let data = communityData.communityData.data.find(comm => comm.id === id);
    let editorStuff = convertFromRaw(JSON.parse(htmlspecialchars_decode(data.details)));
    this.changeState({
      file: [],
      imagePreviewUrl: data.image,
      location: data.location,
      amount: data.fundNeeded * 1,
      editorState: EditorState.createWithContent(editorStuff)
    });
  }

  cleanSlate() {
    this.changeState({
      file: [],
      imagePreviewUrl: '',
      location: '',
      amount: '',
      details: {},
      submitted: 'true',
      notification: 'Submitted Successfully',
      notifDisplay: 'block',
      editorState: EditorState.createEmpty()
    });
  }

  handleFileChange(e) {
    let file = e.target.files[0];
    let picReader = new FileReader();
    if (file !== undefined) {
      picReader.onloadend = () => {
        this.changeState({
          file: file,
          imagePreviewUrl: picReader.result
        });
      };
      picReader.readAsDataURL(file);
    }
  }

  handleChange(e) {
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  componentDidMount() {
    const id = this.props.match.params.id * 1;
    const { sendData, communityData } = this.props;
    const data = JSON.stringify(getAuthUserAll());
    let formData = new FormData();
    if (id) {
      if (!isNaN(id)) {
        if (communityData.communityData.length === 0) {
          formData.append('request', 'get_comm_list');
          formData.append('user_type', getAuthUserType());
          formData.append('data', encodeURIComponent(data));
          sendData(formData);
        } else {
          this.updateState(communityData, id);
        };
      } else {
        this.props.history.push('/community');
      };
    };
  }

  componentDidUpdate(prevProps) {
    const id = this.props.match.params.id * 1;
    let { loading, error, errorMesage, communityData } = this.props.communityData;
    if (this.props !== prevProps) {
      console.log(communityData)
      if (communityData.token !== undefined) {
        setAuthToken(communityData.token);
      } else if (communityData.logoutUser !== undefined && communityData.logoutUser === 'true') {
        signOut();
      }
      if (loading === 'done' && error === 'true') {
        this.changeState({
          notification: errorMesage,
          notifDisplay: 'block',
        });
      } else {
        if (loading === 'done' && communityData.error === 'false' && !id) {
          if (communityData.submitted === 'true') {
            this.cleanSlate();
          }
        } else if (loading === 'done' && communityData.error === 'false' && id) {
          if (communityData.submitted === 'true') {
            this.props.history.push('/community');
          } else {
            this.updateState(this.props.communityData, id);
          }
        } else if (loading === 'done' && communityData.error === 'true') {
          this.changeState({
            notification: communityData.errorMesage,
            notifDisplay: 'block',
          });
        }
      }

    };
  }


  handleSubmit(e) {
    e.preventDefault();
    const id = this.props.match.params.id * 1;
    const { sendData } = this.props;
    const { imagePreviewUrl, file, location, amount, editorState } = this.state;
    const details = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
    const json = JSON.stringify({ "commID": id, location, amount, details, ...getAuthUserAll() });
    let formData = new FormData();
    formData.append('user_type', getAuthUserType());
    formData.append('data', encodeURIComponent(json));
    formData.append('file', file);
    if (id) {
      const { communityData } = this.props.communityData;
      const data = communityData.data.find(comm => comm.id === id);
      if ((data.image === imagePreviewUrl) && (data.location === location) && (data.fundNeeded * 1 === amount) &&
        (htmlspecialchars_decode(data.details) === details)) {
        this.changeState({
          notification: 'You have not made any changes',
          notifDisplay: 'block',
        });
      } else {
        formData.append('request', 'update_comm');
        sendData(formData);
      };
    } else {
      if (file.length === 0) {
        this.changeState({
          notification: 'Please select an image',
          notifDisplay: 'block',
        });
      } else {
        formData.append('request', 'add_comm');
        sendData(formData)
      };
    };
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  };

  render() {
    let { location, amount, imagePreviewUrl, submitted, editorState, notifDisplay, notification } = this.state;
    let { loading } = this.props.communityData;
    let buttonText = '';
    loading === 'done' && submitted === 'true' ? (buttonText = 'SUBMIT') :
      (loading === 'true' ? (buttonText = <div id="loader"></div>) : (buttonText = 'SUBMIT'));

    return (
      <React.Fragment>
        <Row>
          <form encType="multipart/form-data" method="post" onSubmit={this.handleSubmit} className="community_container containerFull">
            <label htmlFor="file" className="file_label">
              <img src={imagePreviewUrl} alt="" />
              <div className="bar_upload">
                <span className="upload_icon straight"></span>
                <span className="upload_icon slanting"></span>
                <span className="upload_icon round"></span>
              </div>
            </label>
            <input type="file" id="file" name="file" className="file" accept="image/*" onChange={this.handleFileChange} ref={this.fileRef} />
            <div className="title">
              <label htmlFor="location"></label>
              <Input type="text" id="location" name="location" className="title_input" value={location} onChange={this.handleChange} placeholder="Enter location here" required />
            </div>
            <hr className="hr" />
            <div className="amount_edit_cover">
              <label htmlFor="amount" className="amount_edit_label">Fund:</label>
              <span>&#8358;</span><Input type="number" name="amount" id="amount" value={amount} className="amount_edit" onChange={this.handleChange} placeholder="Amount" required />
            </div>
            <div style={{ margin: '1.2em', border: '2px solid lightgrey', borderRadius: '0.5em', width: '100%', backgroundColor: 'white' }}>
              <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                  options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'history']
                }}
              />
            </div>
            <button type="submit" name="button" className="btn_donate btn edit"> {buttonText} </button>
          </form>
          <div className="notif" style={{ display: notifDisplay }}>{notification}<span role="img" aria-label="sheep" onClick={this.close}>&#x274E;</span> </div>
        </Row>
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
    sendData: (data) => dispatch(sendCommunityData(data))
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Edit);