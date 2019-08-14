import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from "antd"

class ChangeName extends Component {
    state = {
        isResponseOk: false
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let user = values;
                let bearer_token = sessionStorage.getItem("token");
                fetch("/api/User/changeNames", {
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
                            message.success("Name changed successfuly!");
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
                    {getFieldDecorator('firstName', {
                        rules: [{ required: true, message: 'Please input your first name!' }],
                        initialValue: user.firstName
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="First name"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('lastName', {
                        rules: [{ required: true, message: 'Please input your last name!' }],
                        initialValue: user.lastName
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Last name"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                        initialValue: user.username
                    })(
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="Username"
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

const ChangeNameForm = Form.create({ name: "change_name" })(ChangeName)
export default ChangeNameForm;