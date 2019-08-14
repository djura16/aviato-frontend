import React, { Component } from 'react';
import { Layout, Avatar, Input, Button } from 'antd';

const { Header, Content, Footer } = Layout;
const { TextArea } = Input;

class HomeContent extends Component {
    state = {
        text: ""
    }

    handleText = (input) => {
        let { name, value } = input.target;

        this.setState({
            [name]: value
        })
    }

    post = () => {

        let bearer_token = sessionStorage.getItem("token")
        let post = {
            post: this.state.text
        }
        fetch("/api/Post/add", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            },
            body: JSON.stringify(post)
        })
            .then(response => response.json())
            .then(data => console.log(data))
    }

    render() {
        let onPhone = this.props.onPhone;
        let user = this.props.user;

        return <Layout>
            <Header id="header" style={{ background: '#fff', padding: 0, marginLeft: onPhone ? "0" : "200px" }}>
                <h1>Home</h1>
            </Header>
            <Content id="content-post" className={onPhone ? "content mx-1" : "content"} style={{ marginLeft: "30%" }}>
                <div className="text-center home-post">
                    <div>
                        <Avatar className="home-feed-avatar" size={80} icon="user" src={user !== null ? user.image : ""} />
                        <span className="home-feed-avatar ml-3">
                            <h5 className="text-primary">{user !== null ? user.firstName + " " + user.lastName : ""}</h5>
                            <p
                                style={{
                                    marginTop: -14,
                                    marginLeft: -40,
                                    color: "#9c9a9a"
                                }}
                            >{user !== null ? "@" + user.username : ""}</p>
                        </span>
                        <TextArea placeholder="What's happening?" name="text" onChange={this.handleText} value={this.state.text} maxLength={150} minLength={1} rows={5} style={{ fontSize: "20px", minWidth: onPhone ? "0" : "470px" }} autosize={false} />
                    </div>
                    <div className="home-post-button">
                        <Button className="px-4" onClick={this.post} style={{ float: "right" }} type="primary">Post</Button>
                        <span className={this.state.text.length === 150 ? "mr-3 text-danger" : "mr-3"} style={{ float: "right", marginTop: "7px" }}>{this.state.text.length}</span>
                    </div>
                </div>
            </Content>
            <Content id="content" className={onPhone ? "content mx-1 mt-5" : "content mt-5"} style={{ marginLeft: "30%" }} >
                <div style={{ padding: 24, background: '#fff', minHeight: window.innerHeight - 158 }}>content</div>
            </Content>
            <Footer id="footer" style={{ textAlign: 'center', marginLeft: onPhone ? "0" : "200px" }}>Twitter Quantox ©2019 Created by Aviato</Footer>
        </Layout>;
    }
}

export default HomeContent;