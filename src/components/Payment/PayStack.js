import React, { Component } from 'react'

export class PayStack extends Component {
    constructor(props) {
        super(props)
    
        // this.state = {
        //     orderRef: '',
        //     notification: '',
        //     notifDisplay: 'none'
        // }
        this.payWithPaystack = this.payWithPaystack.bind(this);
    }
    

    componentDidMount() {
        let payStackScript = document.createElement('script');
        payStackScript.src = 'https://js.paystack.co/v1/inline.js';
        payStackScript.async = true;
        window.document.body.appendChild(payStackScript);
    }

    payWithPaystack() {
        const { email , lastName, firstName, total, saveOrder } = this.props.data;
        let handler = window.PaystackPop.setup({
            key: 'pk_test_6dfeae22bb437ba7de70c661408240369aaa8996',
            email: email,
            amount: total * 100,
            firstname: firstName,
            lastname: lastName,
            onClose: function () {
                
            },
            callback: function (response) {
                saveOrder(response.reference);
                // let message = 'Payment complete! Reference: ' + response.reference;
            }
        });
        handler.openIframe();
    }


    render() {
        const { button } = this.props.data;
        return (
            <>
                <button type="submit" className={button[0]} onClick={this.payWithPaystack} disabled={button[3]}> <i className={button[1]}></i> &nbsp; {button[2]}</button>
            </>
        )
    }
}


export default PayStack
