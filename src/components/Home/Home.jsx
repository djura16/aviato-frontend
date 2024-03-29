import React, { Component } from 'react';
import { Layout, Menu, Icon, Avatar, Badge } from 'antd';
import HomeContent from "./HomeContent"
import ProfileContent from "../Profile/ProfileContent"
import Requests from "../Followers/Requests"
import Notification from "../Notifications/Notification"
import {
    Link,
    Switch,
    Route
} from "react-router-dom";
import { getUser } from "../../actions/UserActions"
import { logOutUser } from "../../actions/LoginRegister"
import { signalR } from "../../actions/SignalRActions"
import { changeUser } from "../../actions/userChangeRedux";
import { connect } from "react-redux"
import { getNotifications } from "../../actions/Notifications"

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
        interval: null,
        hubConnection: null,
        online: [],
        posts: [],
        notifications: [],
        unreadNotification: 0,
        notificationSeen: false
    }

    unseenNotification = () => {
        this.setState({
            notificationSeen: false,
            unreadNotification: 0
        })
    }

    seenNotification = () => {
        console.log(this.state);
        this.setState({
            notificationSeen: true
        })
    }

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    clearStorage = () => {
        logOutUser()
        localStorage.clear();
        sessionStorage.clear();
        clearInterval(this.state.interval);
    }

    reloadUser = () => {
        getUser(null, data => {
            this.props.changeUser(data);
            this.setState(state => (
                {
                    user: data,
                    propsUpdate: !state.propsUpdate
                }
            ));
            localStorage.setItem("user", JSON.stringify(data));
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

        setTimeout(() => {
            let username = JSON.parse(localStorage.getItem("user")).username;
            signalR(username, (hubConnection, data) => {
                this.setState({
                    hubConnection,
                    online: data
                }, () => {
                    this.state.hubConnection
                        .start()
                        .then(() => console.log("Connected"))
                        .then(() => {
                            this.state.online.map(user => {
                                this.state.hubConnection.invoke("JoinGroup", user.id);
                            })
                        })
                        .then(() => {
                            this.state.hubConnection.invoke("JoinGroup", this.state.user.username + "Notification");
                        })
                        .catch(e => {
                            console.log(e);
                            console.log("Error connecting");
                        });

                    this.state.hubConnection.on("ReceiveMessage", data => {
                        this.state.posts.unshift(data);
                    })

                    this.state.hubConnection.on("ReceiveNotification", data => {

                        let notifications = this.state.notifications;
                        notifications.unshift(data);
                        this.setState(state => ({
                            unreadNotification: state.unreadNotification + 1,
                            notifications
                        }))
                    })
                })
            })
        }, 500);

        getNotifications(data => {
            this.setState({
                notifications: data
            })
        });
    }

    getAllPosts = () => {
        //SREDITI ZA SIGURNOST
        let bearer_token = sessionStorage.getItem("token");
        fetch("/api/Post/getAllPosts", {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        }).then(response => response.json())
            .then(data => {
                this.setState({
                    posts: data
                })
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
        switch (path) {
            case "/Home/feed":
                return "1"
            case `/Home/user/${this.state.user.username}`:
                return "2"
            case "/Home/user/request":
                return "3"
            case "/Home/user/notifications":
                return "4"
            default:
                break;
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
                            <Menu
                                theme="dark"
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
                                        {/* {this.state.user !== null ? <Avatar style={{ marginLeft: -5, marginRight: 5 }} size="small" icon="user" src={this.state.user.image} /> : ""}<Icon style={{ display: "none" }}></Icon> */}
                                        <Icon type="user"></Icon>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="3">

                                    <Link
                                        to={`/Home/user/request`}
                                        onClick={() => this.setState(state => ({
                                            propsUpdate: !state.propsUpdate
                                        }))}>
                                        <Badge count={this.state.requests.length}>
                                            <Icon type="user-add" />
                                        </Badge>
                                    </Link>

                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Link onClick={() => {
                                        this.setState({
                                            notificationSeen: true
                                        })
                                    }} to="/Home/user/notifications">
                                        <Badge count={this.state.unreadNotification}>
                                            <Icon type="bell" />
                                        </Badge>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Link
                                        onClick={() => {
                                            this.clearStorage()
                                        }}
                                        to="/Login">
                                        <Icon type="logout" />
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Header> :
                        <Sider
                            breakpoint="md"
                            onBreakpoint={broken => {

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
                                        to={`/Home/user/${this.props.user.username}`}
                                        onClick={() => this.setState(state => ({
                                            propsUpdate: !state.propsUpdate
                                        }))}>
                                        {/* {this.state.user !== null ? <Avatar style={{ marginLeft: -5, marginRight: 5 }} size="small" icon="user" src={this.props.user.image} /> : ""} */}
                                        <Icon type="user" />
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
                                            <Icon type="user-add" />
                                            <span className="nav-text">Follow Requests</span>
                                        </Badge>
                                    </Link>

                                </Menu.Item>
                                <Menu.Item key="4">
                                    <Link onClick={() => {
                                        this.setState({
                                            notificationSeen: true
                                        })
                                    }} to="/Home/user/notifications">
                                        <Badge count={this.state.unreadNotification} offset={[20, 7]}>
                                            <Icon type="bell" />
                                            <span className="nav-text">Notification</span>
                                        </Badge>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="5">
                                    <Link onClick={this.clearStorage} to="/Login">
                                        <Icon type="logout" />
                                        <span className="nav-text">Log out</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Sider>}
                    <Switch>
                        <Route exact={true} path="/Home/feed" render={() => <HomeContent onPhone={this.state.onPhone} user={this.state.user} posts={this.state.posts} getAllPosts={this.getAllPosts} />} />
                        <Route exact={true} path='/Home/user/notifications' render={() => <Notification user={this.state.user} onPhone={this.state.onPhone} notifications={this.state.notifications} unreadNotification={this.state.unreadNotification} notificationSeen={this.state.notificationSeen} seeNotification={this.unseenNotification} />} />
                        <Route exact={true} path='/Home/user/request' render={() => <Requests user={this.state.user} onPhone={this.state.onPhone} requests={this.state.requests} reloadRequests={this.loadRequests} />} />
                        <Route exact={true} path='/Home/user/:username' render={() => <ProfileContent propsUpdate={this.state.propsUpdate} onPhone={this.state.onPhone} user={this.state.user} reloadUser={this.reloadUser} getMyPosts={this.getMyPosts} posts={this.state.myPosts} />} />
                    </Switch>
                </Layout> : ""
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state
    }
}

const mapDispatchToProps = ({
    changeUser,
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);