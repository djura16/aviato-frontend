import React, { Component } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { Form, Icon, Input, Button, message } from 'antd';
import { registerUser } from "../../actions/LoginRegister";
import {
    Redirect,
    Link
} from "react-router-dom";

class Register extends Component {
    state = {
        error: false,
        errorMsg: "",
        redirect: false
    }

    handleInputChange = (event) => {
        let name = event.target.name;
        let value = event.target.value
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                registerUser(values, response => {
                    if (response !== undefined) {
                        this.setState({
                            error: true,
                            errorMsg: response
                        })
                    }
                    else {
                        message.success("Successfully registered! You can login now with your username and password.");
                        this.setState({
                            redirect: true
                        })
                    }
                })
            }
        });
    }

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

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

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            this.state.redirect ? <Redirect to="/Login"></Redirect> :
                <Container className="my-5">
                    <Row>
                        <Col sm={1} md={3}></Col>
                        <Col sm={10} md={6}>
                            <Form onSubmit={this.handleSubmit} className="form">
                                <h1>Register</h1>
                                <Form.Item label="First name">
                                    {getFieldDecorator('firstName', {
                                        rules: [{ required: true, message: 'Please input your first name!' }],
                                    })(
                                        <Input
                                            placeholder="Enter your first name"
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            name="firstName"
                                            onChange={this.handleInputChange}
                                        >
                                        </Input>
                                    )}
                                </Form.Item>
                                <Form.Item label="Last name">
                                    {getFieldDecorator('lastName', {
                                        rules: [{ required: true, message: 'Please input your last name!' }],
                                    })(
                                        <Input
                                            placeholder="Enter your last name"
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            name="lastName"
                                            onChange={this.handleInputChange}
                                        >
                                        </Input>
                                    )}
                                </Form.Item>
                                <Form.Item label="E-mail">
                                    {getFieldDecorator('email', {
                                        rules: [
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your E-mail!',
                                            },
                                        ],
                                    })(
                                        <Input
                                            placeholder="Enter your email"
                                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            name="email"
                                            onChange={this.handleInputChange}
                                        >
                                        </Input>
                                    )}
                                </Form.Item>
                                <Form.Item label="Username">
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Input
                                            placeholder="Enter your username"
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            name="username"
                                            onChange={this.handleInputChange}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="Password" hasFeedback>
                                    {getFieldDecorator('password', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                            {
                                                validator: this.validateToNextPassword,
                                            },
                                            {
                                                min: 8
                                            }
                                        ],
                                    })(
                                        <Input.Password
                                            name="password"
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            onChange={this.handleInputChange}
                                            placeholder="Password"
                                            visibilityToggle={false}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item label="Confirm Password" hasFeedback>
                                    {getFieldDecorator('repeatPassword', {
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please confirm your password!',
                                            },
                                            {
                                                validator: this.compareToFirstPassword,
                                            },
                                        ],
                                    })(
                                        <Input.Password
                                            name="repeatPassword"
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            onChange={this.handleInputChange}
                                            placeholder="Repeat password"
                                            visibilityToggle={false}
                                            onBlur={this.handleConfirmBlur}
                                        />
                                    )}
                                </Form.Item>
                                <Button type="primary" htmlType="submit">Submit</Button>
                                <span className="ml-3">Already have account? <Link to="/Login"> Login now! </Link></span>
                                <br />
                                {this.state.error ? <span className="ml-3 text-danger">{this.state.errorMsg}</span> : ""}
                            </Form>
                        </Col>
                        <Col sm={1} md={3}></Col>
                    </Row>
                </Container>);
    }
}

const RegisterForm = Form.create({ name: 'register' })(Register);
export default RegisterForm;