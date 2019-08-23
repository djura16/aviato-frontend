import React, { Component } from 'react';
import { Layout, List, Avatar, Button, message } from 'antd';
import {
    Redirect
} from "react-router-dom";

const { Header, Content, Footer } = Layout;

class Notification extends Component {
    state = {
        loading: false,
        isResponseOk: false,
        notifications: [],
        redirectId: null,
        redirectToPost: false
    }

    componentDidUpdate(prevProps, prevState) {
        console.log(prevProps);
        console.log(this.props);
        if (this.props.notificationSeen) {
            console.log("asdawd");
            this.showNotificationForPeriod()
        }
    }

    showNotificationForPeriod = () => {
        setTimeout(() => {
            this.props.seeNotification();
        }, 1000)
    }

    goToPost = (id) => {
        this.setState({
            redirectId: id,
            redirectToPost: true
        })
    }

    render() {
        if (this.state.redirectToPost) {
            return <Redirect to={`/Home/feed#post${this.state.redirectId}`}></Redirect>
        }
        const user = this.props.user;
        const onPhone = this.props.onPhone;
        let unreads = this.props.unreadNotification;
        return (
            user !== null ?
                <Layout>
                    <Header id="header" style={{ padding: 0, marginLeft: onPhone ? "0" : "200px" }}>
                        <h1>Notification</h1>
                    </Header>
                    <Content id="content" className={onPhone ? "content mx-1" : "content"} style={{ margin: '24px 20% 0', marginLeft: "30%" }}>
                        <div style={{ minHeight: window.innerHeight - 157 }}>
                            <List
                                className="requests"
                                dataSource={this.props.notifications}
                                renderItem={(item, i) =>
                                    <List.Item className={i < unreads ? "unread" : ""} onClick={() => this.goToPost(item.post.id)}>
                                        <Avatar
                                            src={item.user.image}
                                            icon="user"
                                            size={30}
                                        />
                                        <div className="ml-3">
                                            <b>{"@" + item.user.username}</b>
                                        </div>
                                        <span className="ml-2">{item.text}</span>
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

export default Notification;