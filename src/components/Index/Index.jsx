import React, { Component } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import { Form, Icon, Input, Button } from 'antd';
import { loginUser, logOutUser } from "../../actions/LoginRegister";
import {
    Redirect,
    Link
} from "react-router-dom";
import { connect } from "react-redux"
import { changeUser } from "../../actions/userChangeRedux"

class Index extends Component {

    state = {
        redirect: false,
        error: false,
        errorMsg: "",
        isResponseOK: false,
        user: null,
        loading: false
    }

    render() {
        return (
            <Container className="no-scroll">
                <Row>
                    {/* <Col sm={1} md={3} lg={3}></Col> */}
                    <Col sm={10} md={6} lg={21} style={{ marginTop: "20%" }}>
                        <h1>See what’s happening in</h1>
                        <h1 style={{ marginTop: "-25px" }}>the world right now</h1>

                        <br />

                        <h2>Join us now!</h2>
                        <Link to="/Register"><Button style={{ width: "300px" }} type="primary">Sign up</Button></Link>
                        <br />
                        <br />
                        <Link to="/Login"><Button style={{ width: "300px" }}>Log in</Button></Link>
                    </Col>
                    <Col sm={1} md={3} lg={3}></Col>
                </Row>
            </Container>
        );
    }
}

export default Index;