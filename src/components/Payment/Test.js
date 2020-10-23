import React, { Component } from 'react'
import whatever from './whatever'


export class Test extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       
    }
    this.whatever = new whatever();
  }
  
    render() {
      this.whatever.say();
        return (
            <div style={{backgroundColor:'white'}}>
                <table className="table table-striped table-hover table-outline">
                <thead className="">
                {/* <thead className="thead-light"> */}
                  <tr>
                    <th className="text-center"><span role="img" aria-label="people">&#128101;</span></th>
                    <th>User</th>
                    <th className="">Role</th>
                    <th className="">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center" >
                      <div className="c-avatar" >
                        <img style={{height:'3em', border:'1px solid lightgrey', borderRadius:'50%'}} src={'https://swiip.000webhostapp.com/upload/account/6746554796224img_20200805_155545_652_1.png'} className="c-avatar-img" alt="admin@bootstrapmaster.com" />
                        <span className="c-avatar-status bg-success"></span>
                      </div>
                    </td>
                    <td >
                      <div>Yiorgos Avraamu</div>
                      <div className="small text-muted">
                      Reg: Jan 1 2015
                      </div>
                    </td>
                    <td >
                        <span>Agent</span>
                    </td>
                    <td >
                      <span className="confirmed">Active</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-center" >
                      <div className="c-avatar" >
                        <img style={{height:'3em', border:'1px solid lightgrey', borderRadius:'50%'}} src={'https://swiip.000webhostapp.com/upload/account/6746554796224img_20200805_155545_652_1.png'} className="c-avatar-img" alt="admin@bootstrapmaster.com" />
                        <span className="c-avatar-status bg-success"></span>
                      </div>
                    </td>
                    <td >
                      <div>Yiorgos Avraamu</div>
                      <div className="small text-muted">
                      Reg: Jan 1 2015
                      </div>
                    </td>
                    <td >
                        <span>Agent</span>
                    </td>
                    <td >
                      <span className="accepted">Pending</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-center" >
                      <div className="c-avatar" >
                        <img style={{height:'3em', border:'1px solid lightgrey', borderRadius:'50%'}} src={'https://swiip.000webhostapp.com/upload/account/6746554796224img_20200805_155545_652_1.png'} className="c-avatar-img" alt="admin@bootstrapmaster.com" />
                        <span className="c-avatar-status bg-success"></span>
                      </div>
                    </td>
                    <td >
                      <div>Yiorgos Avraamu</div>
                      <div className="small text-muted">
                      Reg: Jan 1 2015
                      </div>
                    </td>
                    <td >
                        <span>Agent</span>
                    </td>
                    <td >
                      <span className="accepted">Pending</span>
                    </td>
                  </tr>

                </tbody>
              </table>  
            </div>
        )
    }
}

export default Test
