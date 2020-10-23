import React, { Component } from 'react'
import { Row, Input, Button, Col } from 'reactstrap'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { getAuthUserType, getAuthUserAll } from '../../../services/Auth';
import { sendFetchAccountData } from '../../../store/actions/user';

export class Support extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             email: '',
        }
        this.handChange = this.handChange.bind(this);
    }

    handChange(e) {
      this.setState({
        [e.target.id]: e.target.value
      })
    }
    

    render() {
      const {email} = this.state;
        return (
            <div style={{marginTop:'2em',textAlign:'center'}}>
              <div style={{marginBottom:'5em', width:'100%'}}>
              <Button type="button" color="dark"><a href="mailto:help@swiip.000webhostapp.com" style={{color:'white'}}>Contact Us</a></Button>
              </div>
              <h3>About</h3>
              <p>The purpose of this application is to improve the condition and quality of living in a country like Nigeria.</p>
              <p>My soul aim is to reduce the amount of litered waste in the country by JOIN effort and DONATION through crowd funding to enhance the 
                state of our road and COMMUNITY. </p>
              <p>Feel free to SUPPORT your COMMUNITY and you can also contact us if you want your community to be INCLUDED in our list (terms and condition applies)</p><br/><br/>
              <h3>Policy</h3>
              <p>This application has an OPEN SOURCE LISENCE and so therefore open to copy, modification and so thereof...</p>
              <p>This project also aim to be a boiler plate for beginners and those who needs an admin panel with some logic, i.e redux,router, protected route etc included.</p>
              <p>I also feel anyone hoping to build something around this idea for there state or country can take one or two ideas from this application</p>
              <p>This is the first version written using procedural PHP, MySQL, Javascript, CSS & HTML. This uses classes rather than the new stateless function.</p>
              <p>For the PHP source code, you can check my Git repo @johnerry</p>
            </div>
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
  )(Support);