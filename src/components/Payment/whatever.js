import React, { Component } from 'react'

export class whatever extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
        this.say = this.say.bind(this);
    }

    say() {
        console.log('helllo, i am whatever function from another class')
    }

    
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default whatever
