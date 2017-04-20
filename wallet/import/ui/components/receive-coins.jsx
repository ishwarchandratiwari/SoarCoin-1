import {Meteor} from "meteor/meteor";
import {EJSON} from "meteor/ejson";
import React, {PureComponent} from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import FlatButton from "material-ui/FlatButton";
import Toggle from "material-ui/Toggle";
import TextField from "material-ui/TextField";
import Dialog from "material-ui/Dialog";
import enMsg from "../i18n/en-labels.json";
import {QRCode} from "react-qr-svg";
import {getWeb3} from "../../ethereum/ethereum-services";
import {currentProfile} from "../../model/profiles"

const style = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
};

export default class ReceiveCoins extends TrackerReact(PureComponent) {
    constructor(props, context) {
        super(props, context);

        this.state = {
            bigQr: true,
            amount: 0
        };

        this._toggleBigQr = this._toggleBigQr.bind(this);
        this._handleChange = this._handleChange.bind(this);
    }

    _toggleBigQr() {
        this.setState({bigQr: !this.state.bigQr});
    }

    _handleChange(event, value) {
        let change = {};
        change[event.target.id] = value;
        this.setState(change);
    }

    componentDidMount() {
        console.log("receive did mount");
        if (this.amountInput) this.amountInput.select();
    }

    render() {
        /*only show this if there is a logged in user*/
        if (!Meteor.userId()) return null;

        const qrValue = EJSON.stringify({
            address: currentProfile().address,
            amount: this.state.amount
        })
        //TODO: when amount is not 0 listen for transfer event
        return (
            <div style={style}>
                <QRCode
                    value={qrValue}
                    size={256}
                    level="Q"
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    onClick={this._toggleBigQr}
                />
                <TextField
                    id="amount"
                    type="number"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={this.state.amount}
                    hintText={enMsg.appBar.amountIn}
                    errorText={this.state.amountError}
                    floatingLabelText={enMsg.appBar.amountIn}
                    onChange={this._handleChange}
                    ref={(input) => this.amountInput = input}
                />

            </div>
        )

    }
}
