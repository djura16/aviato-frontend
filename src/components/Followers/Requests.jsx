import React, { Component } from 'react';
import { Layout, List, Avatar, Divider, Button, Modal, Icon, Upload, message } from 'antd';

const { Header, Content, Footer } = Layout;

class Requests extends Component {
    state = {
        loading: false,
        isResponseOk: false
    }

    acceptFollow = (id) => {
        let bearer_token = sessionStorage.getItem("token");
        let follow = {
            id
        }
        fetch("/api/Following/acceptFollow", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            },
            body: JSON.stringify(follow)
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
                    this.props.reloadRequests();
                    message.success(data.msg);
                }
                else {
                    message.error(data.msg);
                }
            })
    }

    declineFollow = (id) => {
        let bearer_token = sessionStorage.getItem("token");
        let follow = {
            id
        }
        fetch("/api/Following/declineFollow", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            },
            body: JSON.stringify(follow)
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
                    this.props.reloadRequests();
                    message.success(data.msg);
                }
                else {
                    message.error(data.msg);
                }

            })
    }

    render() {
        console.log(this.props);
        const user = this.props.user;
        const onPhone = this.props.onPhone;
        const requests = this.props.requests;
        return (
            user !== null ?
                <Layout>
                    <Header id="header" style={{ background: '#fff', padding: 0, marginLeft: onPhone ? "0" : "200px" }}>
                        <h1>Follow requests</h1>
                    </Header>
                    <Content id="content" className={onPhone ? "content mx-1" : "content"} style={{ margin: '24px 20% 0', marginLeft: "30%" }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: window.innerHeight - 158 }}>
                            <List
                                dataSource={requests}
                                renderItem={item =>
                                    <List.Item>
                                        <Avatar
                                            src={item.follower.image}
                                            icon="user"
                                            size={50}
                                        />
                                        <div className="ml-3">
                                            <b>{item.follower.firstName + " " + item.follower.lastName}</b>
                                            <br />
                                            <p style={{ marginTop: "-8px" }}>{"@" + item.follower.username}</p>
                                        </div>
                                        <Button onClick={() => this.declineFollow(item.id)} icon="close" type="danger" style={{ position: "absolute", right: 0 }}></Button>
                                        <Button onClick={() => this.acceptFollow(item.id)} icon="check" type="primary" style={{ position: "absolute", right: 50 }}>Accept</Button>
                                    </List.Item>
                                }
                            />
                        </div>
                    </Content>
                    <Footer id="footer" style={{ textAlign: 'center', marginLeft: onPhone ? "0" : "200px" }}>Twitter Quantox ©2019 Created by Aviato</Footer>
                </Layout> : this.state.loading
        );
    }
}

export default Requests;