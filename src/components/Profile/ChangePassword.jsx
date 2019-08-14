import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from "antd"

class ChangePassword extends Component {
    state = {
        isResponseOk: false,
        confirmDirty: false
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let user = values;
                let bearer_token = sessionStorage.getItem("token");
                fetch("/api/User/changePassword", {
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

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Item hasFeedback>
                    {getFieldDecorator('oldPassword', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input old password!',
                            },
                            {
                                min: 8,
                                message: "Password must be at least 8 characters long."
                            }
                        ],
                    })(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Old Password" />)}
                </Form.Item>
                <Form.Item hasFeedback>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input new password!',
                            },
                            {
                                validator: this.validateToNextPassword,
                            },
                            {
                                min: 8,
                                message: "Password must be at least 8 characters long."
                            }
                        ],
                    })(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="New Password" />)}
                </Form.Item>
                <Form.Item hasFeedback>
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            {
                                validator: this.compareToFirstPassword,
                            },
                            {
                                min: 8,
                                message: "Password must be at least 8 characters long."
                            }
                        ],
                    })(<Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Confirm new password" onBlur={this.handleConfirmBlur} />)}
                </Form.Item>
                <Form.Item>
                    <Button style={{ float: "right" }} type="primary" htmlType="submit">Save</Button>
                </Form.Item>
            </Form>
        );
    }
}

const ChangePasswordForm = Form.create({ name: "password_form" })(ChangePassword)
export default ChangePasswordForm;