import React, { Component } from 'react';
import { Layout, Avatar, Divider, Button, Modal, Icon, Upload, message, Row, Col } from 'antd';
import Post from "../Posts/Post"
import { beforeUpload, getBase64 } from "../../actions/imageUpload"
import AvatarEditor from "react-avatar-editor"
import ChangeName from "./ChangeName"
import ChangeEmail from "./ChangeEmail"
import ChangePassword from "./ChangePassword"
import ChangePrivacy from "./ChangePrivacy"
import ProfileFollowers from "./ProfileFollowers"
import { getUser } from "../../actions/UserActions"

const { Header, Content, Footer } = Layout;

class ProfileContent extends Component {
    state = {
        posts: [],
        modalVisible: false,
        user: null,
        isResponseOk: false,
        loading: true,
        error: false,
        followers: 0,
        following: 0,
        seeFollower: false,
        modalOption: null
    }

    followUnfollowUser = (action) => {
        let username = window.location.pathname.split("/");
        let bearer_token = sessionStorage.getItem("token");
        let user = {
            username: username[3]
        }
        fetch(`/api/Following/${action}`, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            },
            body: JSON.stringify(user)
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
                response.json()
            })
            .then(data => {
                if (this.state.isResponseOk) {
                    this.loadUser();
                }
            })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.propsUpdate !== this.props.propsUpdate) {
            this.loadUser()
        }
    }

    componentDidMount() {
        this.loadUser();
    }

    getFollowers = () => {
        let username = window.location.pathname.split("/");
        let bearer_token = sessionStorage.getItem("token");
        fetch(`/api/Following/getNumberOfFollowers?username=${username[3]}`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    followers: data
                })
            })

        fetch(`/api/Following/getNumberOfFollowing?username=${username[3]}`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    following: data
                })
            })
    }

    loadUser = () => {
        let username = window.location.pathname.split("/");
        getUser(username[3], data => {
            if (data.msg === undefined) {
                this.setState({
                    user: data,
                    loading: false,
                    modalOption: null
                });
                this.props.getMyPosts(username[3]);
                this.getFollowers();
            }
            else {
                this.setState({
                    error: true,
                    loading: false
                })
            }
        })
    }

    showCloseModal = () => {
        this.setState(state => (
            {
                modalVisible: !state.modalVisible
            }
        ))
    }

    handleImageChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    }

    openFollowersModal = () => {
        this.setState({
            seeFollower: true
        })
    }

    closeFollowersModal = () => {
        this.setState({
            seeFollower: false,
            modalOption: null
        })
    }

    cancelImageChange = () => {
        this.setState({
            imageUrl: null
        })
    }

    onImageSave = () => {
        if (this.editor) {
            const canvas = this.editor.getImageScaledToCanvas().toDataURL();
            let user = {
                image: canvas
            }
            let bearer_token = sessionStorage.getItem("token");
            fetch("/api/User/changeImage", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + bearer_token
                },
                body: JSON.stringify(user)
            })
                .then(response => {
                    if (response.ok) {
                        message.success("Image uploaded successfully!")
                    }
                    return response.json()
                })
                .then(data => {
                    this.props.reloadUser();
                    this.loadUser();
                    this.setState({
                        imageUrl: null
                    })
                })
        }
    }

    setEditorRef = (editor) => this.editor = editor

    render() {
        const user = this.state.user;
        const posts = this.props.posts;
        const onPhone = this.props.onPhone;

        return (
            user !== null ?
                <Layout>
                    <Header id="header" style={{ background: '#fff', padding: 0, marginLeft: onPhone ? "0" : "200px" }}>
                        <b><h1 className="ml-3">{user.firstName} {user.lastName}</h1></b>
                    </Header>
                    <Content id="content" className={onPhone ? "content mx-1" : "content"} style={{ margin: '24px 20% 0', marginLeft: "30%" }}>
                        <div style={{ padding: 24, minHeight: window.innerHeight - 158 }}>
                            <div className="text-center">
                                <Avatar style={{ border: "3px solid #c2d7ea" }} size={100} icon="user" src={user.image}></Avatar>
                                <h4>{user.firstName + " " + user.lastName}</h4>
                                <p style={{
                                    marginTop: -12,
                                    color: "#9c9a9a"
                                }}
                                >{"@" + user.username}</p>
                                <Row>
                                    <Col md={8} sm={8} lg={8}>
                                        <div className="followers text-center" style={{ cursor: "pointer" }}>
                                            <div
                                                className="followers-text"
                                                onClick={() => this.setState({
                                                    modalOption: 1
                                                }, () => this.openFollowersModal())}>
                                                <b>Followers</b>
                                                <br />
                                                <b>{this.state.followers}</b>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={8} lg={8}>
                                        <div className="followers text-center">
                                            <div>
                                                <b>Posts</b>
                                                <br />
                                                <b>{posts.length}</b>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={8} sm={8} lg={8}>
                                        <div className="following" style={{ cursor: "pointer" }}>
                                            <div
                                                className="following-text"
                                                onClick={() => this.setState({
                                                    modalOption: 0
                                                }, () => this.openFollowersModal())}>
                                                <b>Following</b>
                                                <br />
                                                <b>{this.state.following}</b>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>






                                {user.isMine ?
                                    <Button
                                        className="mt-3"
                                        shape="round"
                                        icon="edit"
                                        type="primary"
                                        onClick={this.showCloseModal}
                                    >Edit</Button> :
                                    user.isFollowing ?
                                        <Button
                                            className="mt-3"
                                            shape="round"
                                            icon="minus"
                                            type="primary"
                                            onClick={() => this.followUnfollowUser("unfollow")}
                                        >Unfollow</Button> :
                                        user.requestSend ?
                                            <Button
                                                className="mt-3"
                                                shape="round"
                                                icon="minus"
                                                type="danger"
                                                onClick={() => this.followUnfollowUser("unfollow")}
                                            >
                                                Request sent
                                        </Button> :
                                            <Button
                                                className="mt-3"
                                                shape="round"
                                                icon="plus"
                                                type="primary"
                                                onClick={() => this.followUnfollowUser("follow")}
                                            >Follow</Button>}

                                <Divider />
                            </div>
                            {user.isMine || user.isPublic || user.isFollowing ?
                                posts.map((item, i) => (
                                    <Post key={"post" + i} getMyPosts={this.props.getMyPosts} post={item.post} likes={item.numberOfLikes} isLiked={item.isLiked} user={user} comment={item.comments} />
                                )) : <h1 className="text-center text-primary">Follow user to see his/her posts!</h1>}
                        </div>
                    </Content>
                    <Footer id="footer" style={{ textAlign: 'center', marginLeft: onPhone ? "0" : "200px" }}>Twitter Quantox ©2019 Created by Aviato</Footer>
                    <Modal
                        title="EDIT PROFILE"
                        visible={this.state.modalVisible}
                        onCancel={this.showCloseModal}
                        footer={[
                            <Button key="back" onClick={this.showCloseModal}>
                                Close
                            </Button>
                        ]}
                    >
                        <div className="text-center">
                            {
                                this.state.imageUrl ?
                                    <div>
                                        <AvatarEditor
                                            ref={this.setEditorRef}
                                            image={this.state.imageUrl}
                                            width={100}
                                            height={100}
                                            border={10}
                                            color={[255, 255, 255, 0.6]} // RGBA
                                            scale={1.2}
                                            rotate={0}
                                            borderRadius={100}
                                        />
                                        <br />
                                        <Button type="primary" onClick={this.onImageSave} >Save</Button>
                                        <Button onClick={this.cancelImageChange}>Cancel</Button>
                                    </div> :
                                    <Upload
                                        id="upload"
                                        showUploadList={false}
                                        beforeUpload={beforeUpload}
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        onChange={this.handleImageChange}
                                    >
                                        <div style={{ display: "inline-block", position: "relative" }}>
                                            <Avatar size={100} icon="user" src={user.image} ></Avatar>
                                            <div className="avatar-profile"></div>
                                            <Icon title="Change profile picture" className="avatar-icon" style={{ position: "absolute", top: 38, left: 38, fontSize: "25px", color: "white" }} type={this.state.loading ? "loading" : "camera"}></Icon>

                                        </div>
                                    </Upload>
                            }
                            <Divider />
                            <ChangeName user={user} reloadUser={this.props.reloadUser} />
                            <Divider />
                            <ChangeEmail user={user} reloadUser={this.props.reloadUser} />
                            <Divider />
                            <ChangePassword user={user} reloadUser={this.props.reloadUser} />
                            <Divider />
                            <ChangePrivacy user={user} reloadUser={this.props.reloadUser} />
                        </div>
                    </Modal>
                    <ProfileFollowers visibleModal={this.state.seeFollower} modalOption={this.state.modalOption} closeFollowersModal={this.closeFollowersModal} loadUser={this.loadUser} />
                </Layout> : this.state.loading ? <div className="text-primary text-center" style={{ marginTop: window.innerHeight / 2 - 100, marginLeft: window.innerWidth / 2 }}><Icon type="loading" style={{ fontSize: "100px", fontWeight: "bold" }} /></div> : <div style={{ width: "100%" }}><h1 className="text-primary text-center" style={{ marginTop: window.innerHeight / 2 - 100 }}>User does not exist! :(</h1></div>
        );
    }
}

export default ProfileContent;