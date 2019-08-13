import React, { Component } from 'react';
import { Layout, Menu, Icon, Avatar } from 'antd';
import HomeContent from "./HomeContent"
import ProfileContent from "../Profile/ProfileContent"
import {
    Redirect,
    Link,
    Switch,
    Route
} from "react-router-dom";

const { Sider } = Layout;

class Home extends Component {
    state = {
        onPhone: false,
        collapsed: false,
        user: null,
        post: []
    }

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    clearStorage = () => {
        console.log("brisem");
        localStorage.clear();
        sessionStorage.clear();
    }

    componentDidMount() {


        setTimeout(() => {
            let user = JSON.parse(localStorage.getItem("user"));
            this.setState({
                user
            })
        }, 500)


        let bearer_token = sessionStorage.getItem("token");
        fetch("/api/Post/getMyPosts", {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        }).then(response => response.json()).then(data => console.log(data))
        console.log(this.state);
    }

    render() {
        return (
            <Layout>
                <Sider
                    breakpoint="sm"
                    // collapsedWidth="0"
                    onBreakpoint={broken => {

                        console.log(broken);
                        if (broken) {
                            this.setState({
                                onPhone: true
                            })
                            if (document.getElementById("header") !== null) {
                                document.getElementById("header").style.marginLeft = "81px";
                                document.getElementById("content").style.marginLeft = "81px";
                                document.getElementById("footer").style.marginLeft = "81px";
                            }
                        }
                        else {
                            this.setState({
                                onPhone: false
                            })
                            if (document.getElementById("header") !== null) {
                                document.getElementById("header").style.marginLeft = "200px"
                                document.getElementById("content").style.marginLeft = "200px"
                                document.getElementById("footer").style.marginLeft = "200px"
                            }
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
                    <Menu theme="dark" mode="inline" defaultSelectedKeys="1">
                        <Menu.Item key="1">
                            <Link to="/Home/feed">
                                <Icon type="home" />
                                <span className="nav-text">Home</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/Home/profile">
                                {this.state.user !== null ? <Avatar style={{ marginLeft: -5, marginRight: 5 }} size="small" icon="user" src={this.state.user.image} /> : ""}<Icon style={{ display: "none" }}></Icon>
                                <span className="nav-text">Profile</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link onClick={this.clearStorage} to="/Login">
                                <Icon type="logout" />
                                <span className="nav-text">Log out</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Switch>
                    <Route exact={true} path="/Home/feed" render={() => <HomeContent onPhone={this.state.onPhone} />} />
                    <Route exact={true} path="/Home/profile" render={() => <ProfileContent onPhone={this.state.onPhone} user={this.state.user} />} />
                </Switch>
            </Layout>
        );
    }
}

export default Home;