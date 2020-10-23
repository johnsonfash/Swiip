import React from 'react';
import { EditorState, convertToRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';


class Draft extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty()
    }

    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    // this.sendState = this.props.getData.changeEditorState;
  }


  onEditorStateChange(editorState) {
    // SAVE CONVERTTORAW IN STATE LIKE THAT TILL YOU USE STRINGIFY TO SEND AND STORE IN DB
    // let json = convertToRaw(editorState.getCurrentContent());
    this.setState({
      editorState,
    });
  };

  componentDidMount() {
  // JSON.PARSE DETAIL STRING, THEN USE CONVERT FROM RAW BEFORE USING EDITORSTATE.CREATEWITHCONTENT (json is object)
  // this.setState({
  //   editorState: EditorState.createWithContent(convertFromRaw(RealjsonObject))
  // })
  }


  render() {
    const { editorState } = this.state;
    return (
      <>
        <div style={{ margin: '1.2em',border:'2px solid lightgrey',borderRadius:'0.5em',height: '400px', backgroundColor: 'white' }}>
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
        <textarea style={{width:'700px',height:'200px',marginTop:'10px', backgroundColor:'white'}}
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
      </>
    );
  }
}

export default Draft