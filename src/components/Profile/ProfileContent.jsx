import React, { Component } from 'react';
import { Layout, Avatar, Divider, Button } from 'antd';
import Post from "../Posts/Post"

const { Header, Content, Footer } = Layout;

class ProfileContent extends Component {
    state = {
        posts: []
    }

    componentDidMount() {
        let bearer_token = sessionStorage.getItem("token");
        fetch("/api/Post/getMyPosts", {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        }).then(response => response.json()).then(data => {
            this.setState({
                posts: data
            })
        })
    }

    render() {
        const user = this.props.user;
        let onPhone = this.props.onPhone;
        return (
            user !== null ?
                <Layout>
                    <Header id="header" style={{ background: '#fff', padding: 0, marginLeft: onPhone ? "81px" : "200px" }}>
                        <b><h3 className="ml-3">{user.firstName} {user.lastName}</h3></b>
                    </Header>
                    <Content id="content" style={{ margin: '24px 16px 0', marginLeft: onPhone ? "81px" : "200px" }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: window.innerHeight - 158 }}>
                            <div className="text-center">
                                <Avatar style={{ border: "3px solid #c2d7ea" }} size={100} icon="user" src={user.image}></Avatar>
                                <h4>{user.firstName + " " + user.lastName}</h4>
                                <p style={{
                                    marginTop: -12,
                                    color: "#9c9a9a"
                                }}
                                >{"@" + user.username}</p>
                                <Button shape="round" icon="edit" type="primary">Edit</Button>
                                <Divider></Divider>
                            </div>

                            {this.state.posts.map(item => (
                                <div>
                                    <Post post={item}></Post>
                                    <Divider></Divider>
                                </div>
                            ))}


                        </div>
                    </Content>
                    <Footer id="footer" style={{ textAlign: 'center', marginLeft: onPhone ? "81px" : "200px" }}>Twitter Quantox ©2019 Created by Aviato</Footer>
                </Layout> : ""
        );
    }
}

export default ProfileContent;