import React, { Component } from 'react';
import { Layout, Menu, Icon, Avatar, Button, Badge } from 'antd';
import HomeContent from "./HomeContent"
import ProfileContent from "../Profile/ProfileContent"
import Requests from "../Followers/Requests"
import {
    Link,
    Switch,
    Route
} from "react-router-dom";

const { Sider, Header } = Layout;

class Home extends Component {
    state = {
        onPhone: false,
        collapsed: false,
        user: null,
        myPosts: [],
        propsUpdate: false,
        isResponseOk: false,
        requests: [],
        interval: null
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    clearStorage = () => {
        localStorage.clear();
        sessionStorage.clear();
        clearInterval(this.state.interval);
    }

    getUser = () => {
        let username = JSON.parse(localStorage.getItem("user")).username;
        let bearer_token = sessionStorage.getItem("token");
        fetch(`/api/User/getUserByUsername?username=${username}`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("user", JSON.stringify(data));
                this.setState({
                    user: data
                })
            })
    }

    componentDidMount() {
        setTimeout(() => {
            let user = JSON.parse(localStorage.getItem("user"));
            this.setState({
                user
            })
        }, 500);
        this.getMyPosts();

        this.loadRequests();
        let interval = setInterval(() => {
            this.loadRequests();
        }, 10000);

        this.setState({
            interval
        })
    }

    getMyPosts = (username = null) => {
        let bearer_token = sessionStorage.getItem("token");

        if (username != null) {
            let user = {
                username
            }
            fetch("/api/Post/getPosts", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + bearer_token
                },
                body: JSON.stringify(user)
            })
                .then(response => response.json())
                .then(data => {
                    this.setState({
                        myPosts: data
                    })
                })
        }
    }

    selectedItemInMenu = () => {
        let path = window.location.pathname;
        if (path === "/Home/feed") {
            return "1"
        }
        else if (path === `/Home/user/${this.state.user.username}`) {
            return "2"
        }
    }

    loadRequests = () => {
        let bearer_token = sessionStorage.getItem("token");
        fetch('/api/Following/getFollowRequest', {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
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
                return response.json();
            })
            .then(data => {
                if (this.state.isResponseOk) {
                    this.setState({
                        requests: data
                    })
                }
            })
    }

    render() {
        return (
            this.state.user !== null ?
                <Layout>
                    {this.state.onPhone ?
                        <Header
                            className="text-center"
                            style={{
                                position: "fixed",
                                top: 0,
                                width: "100%",
                                zIndex: 100
                            }}
                        >
                            <Sider
                                breakpoint="md"
                                // collapsedWidth="0"
                                onBreakpoint={broken => {

                                    console.log(broken);
                                    if (broken) {
                                        if (document.getElementById("header") !== null) {
                                            document.getElementById("header").style.marginLeft = "0px";
                                            document.getElementById("content").style.marginLeft = "30%";
                                            document.getElementById("footer").style.marginLeft = "16px";
                                        }
                                        this.setState({
                                            onPhone: true
                                        })

                                    }
                                    else {
                                        if (document.getElementById("header") !== null) {
                                            document.getElementById("header").style.marginLeft = "200px"
                                            document.getElementById("content").style.marginLeft = "30%"
                                            document.getElementById("footer").style.marginLeft = "200px"
                                        }
                                        this.setState({
                                            onPhone: false
                                        })

                                    }
                                }}
                                style={{
                                    display: "none"
                                }}
                            ></Sider>
                            <Menu theme="dark"
                                mode="horizontal"
                                defaultSelectedKeys={[this.selectedItemInMenu()]}
                                style={{ lineHeight: '64px' }}>
                                <Menu.Item key="1">
                                    <Link to="/Home/feed">
                                        <Icon type="home" />

                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link
                                        to={`/Home/user/${this.state.user.username}`}
                                        onClick={() => this.setState(state => ({
                                            propsUpdate: !state.propsUpdate
                                        }))}>
                                        {this.state.user !== null ? <Avatar style={{ marginLeft: -5, marginRight: 5 }} size="small" icon="user" src={this.state.user.image} /> : ""}<Icon style={{ display: "none" }}></Icon>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <Link onClick={this.clearStorage} to="/Login">
                                        <Icon type="logout" />

                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Header> :
                        <Sider
                            breakpoint="md"
                            // collapsedWidth="0"
                            onBreakpoint={broken => {

                                console.log(broken);
                                if (broken) {
                                    if (document.getElementById("header") !== null) {
                                        document.getElementById("header").style.marginLeft = "0";
                                        document.getElementById("content").style.marginLeft = "30%";
                                        document.getElementById("footer").style.marginLeft = "0";
                                    }
                                    this.setState({
                                        onPhone: true
                                    })

                                }
                                else {
                                    if (document.getElementById("header") !== null) {
                                        document.getElementById("header").style.marginLeft = "200px"
                                        document.getElementById("content").style.marginLeft = "30%"
                                        document.getElementById("footer").style.marginLeft = "216px"
                                    }
                                    this.setState({
                                        onPhone: false
                                    })

                                }


                            }}
                            // onCollapse={(collapsed, type) => {
                            //     console.log(collapsed, type);
                            // }}
                            collapsed={this.state.collapsed} onCollapse={this.onCollapse}
                            style={{
                                overflow: 'auto',
                                position: 'fixed',
                                left: 0,
                                height: window.innerHeight
                            }}
                        >
                            <div className="logo" />
                            <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.selectedItemInMenu()]}>
                                <Menu.Item key="1">
                                    <Link to="/Home/feed">
                                        <Icon type="home" />
                                        <span className="nav-text">Home</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link
                                        to={`/Home/user/${this.state.user.username}`}
                                        onClick={() => this.setState(state => ({
                                            propsUpdate: !state.propsUpdate
                                        }))}>
                                        {this.state.user !== null ? <Avatar style={{ marginLeft: -5, marginRight: 5 }} size="small" icon="user" src={this.state.user.image} /> : ""}
                                        <span className="nav-text">Profile</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="3">

                                    <Link
                                        to={`/Home/user/request`}
                                        onClick={() => this.setState(state => ({
                                            propsUpdate: !state.propsUpdate
                                        }))}>
                                        <Badge count={this.state.requests.length} offset={[20, 7]}>
                                            <Icon type="user" />
                                            <span className="nav-text">Follow Requests</span>
                                        </Badge>
                                    </Link>

                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Link onClick={this.clearStorage} to="/Login">
                                        <Icon type="logout" />
                                        <span className="nav-text">Log out</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Sider>}
                    <Switch>
                        <Route exact={true} path="/Home/feed" render={() => <HomeContent onPhone={this.state.onPhone} user={this.state.user} />} />
                        <Route exact={true} path='/Home/user/request' render={() => <Requests user={this.state.user} onPhone={this.state.onPhone} requests={this.state.requests} reloadRequests={this.loadRequests} />} />
                        <Route exact={true} path='/Home/user/:username' render={() => <ProfileContent propsUpdate={this.state.propsUpdate} onPhone={this.state.onPhone} user={this.state.user} reloadUser={this.getUser} getMyPosts={this.getMyPosts} posts={this.state.myPosts} />} />
                    </Switch>
                </Layout> : ""
        );
    }
}

export default Home;