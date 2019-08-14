import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from "antd"

class ChangeEmail extends Component {
    state = {
        isResponseOk: false
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let user = values;
                let bearer_token = sessionStorage.getItem("token");
                fetch("/api/User/changeEmail", {
                    method: "post",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + bearer_token
                    },
                    body: JSON.stringify(user)
                })
                    .then(response => {
                        if (response.ok) {
                            this.setState({
                                isResponseOk: true
                            })
                        }
                        else {
                            this.setState({
                                isResponseOk: false
                            })
                        }
                        return response.json()
                    })
                    .then(data => {
                        if (this.state.isResponseOk) {
                            message.success("Email changed successfuly!");
                            this.props.reloadUser();
                        }
                        else {
                            message.error(data.msg);
                        }
                    })
            }
        });
    }

    render() {
        let user = this.props.user;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item>
                    {getFieldDecorator('email', {
                        rules:
                            [{
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!',
                            }],
                        initialValue: user.email
                    })(
                        <Input
                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Email"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    <Button style={{ float: "right" }} type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        );
    }
}

const ChangeEmailForm = Form.create({ name: "email_form" })(ChangeEmail)
export default ChangeEmailForm;