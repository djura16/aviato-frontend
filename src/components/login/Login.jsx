import React, { Component } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { Form, Icon, Input, Button } from 'antd';
import { loginUser, logOutUser } from "../../actions/LoginRegister";
import {
    Redirect,
    Link
} from "react-router-dom";

class Login extends Component {
    state = {
        redirect: false,
        error: false,
        errorMsg: "",
        isResponseOK: false,
        user: null,
        loading: false
    }

    handleInputChange = (event) => {
        let name = event.target.name;
        let value = event.target.value
        this.setState({
            [name]: value,
            error: false
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            loading: true
        })

        this.props.form.validateFields((err, values) => {
            if (!err) {
                loginUser(values, response => {
                    if (response !== undefined) {
                        this.setState({
                            errorMsg: response,
                            loading: false
                        })
                    }
                    else {
                        window.onbeforeunload = function (e) {
                            logOutUser();
                        };
                        this.setState({
                            redirect: true,
                            loading: false
                        })
                    }
                })
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        if (this.state.redirect) {
            return <Redirect to="/Home/feed"></Redirect>
        }
        return (
            <Container>
                <Row className="mt-5">
                    <Col sm={1} md={3}></Col>
                    <Col sm={10} md={6}>
                        {this.state.loading ? <div className="text-center text-primary" style={{ marginTop: "40%" }}><Icon type="loading" style={{ fontSize: "100px" }}></Icon></div> :
                            <Form onSubmit={this.handleSubmit}>
                                <h1>Login</h1>
                                <Form.Item>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: 'Please input your username!' }],
                                    })(
                                        <Input
                                            placeholder="Enter your username"
                                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            name="username"
                                            onChange={this.handleInputChange}
                                            className={this.state.error ? "has-error" : ""}
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your Password!' }],
                                    })(
                                        <Input.Password
                                            name="password"
                                            onChange={this.handleInputChange}
                                            placeholder="Enter your password"
                                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                            className={this.state.error ? "has-error" : ""}

                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Log in
                                </Button>
                                    <span className="ml-3">Or </span> <Link to="/Register">register now!</Link>
                                    {this.state.error ? <span className="ml-3 text-danger">{this.state.errorMsg}</span> : ""}
                                </Form.Item>

                                {/* <Button htmlType="submit">Submit</Button>
                            <span className="ml-3">Don't have an account? <Link to="/Register"> Register now! </Link></span>
                            <br />
                            {this.state.error ? <span className="ml-3 text-danger">{this.state.errorMsg}</span> : ""} */}
                            </Form>}
                    </Col>
                    <Col sm={1} md={3}></Col>
                </Row>
            </Container>
        );
    }
}
const LoginForm = Form.create({ name: 'login_form' })(Login);
export default LoginForm;