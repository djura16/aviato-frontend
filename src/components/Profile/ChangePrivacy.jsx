import React, { Component } from 'react';
import { Form, message, Switch } from "antd"

class ChangePrivacy extends Component {

    state = {
        loading: false
    }

    handleChange = (value) => {
        this.setState({
            loading: true
        })
        let bearer_token = sessionStorage.getItem("token");
        fetch("/api/User/changePrivacy", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        })
            .then(response => {

                this.setState({
                    loading: false
                }, () => {
                    if (value) {
                        message.success("You are now private!")
                    }
                    else {
                        message.success("You are now public!")
                    }
                })
            })
        this.props.reloadUser();
    }
    render() {
        const user = this.props.user;
        return (
            <Form>
                <Form.Item>
                    <p style={{ float: "left" }}>Private account: </p>
                    <Switch loading={this.state.loading} onChange={this.handleChange} checked={!user.isPublic} className="ml-3" style={{ float: "left", marginTop: "9px" }} />
                </Form.Item>
            </Form>);
    }
}

export default ChangePrivacy;