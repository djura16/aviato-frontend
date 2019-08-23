import React, { Component } from 'react';
import { Comment, Icon, Tooltip, Avatar, Divider, Button, Modal, Input } from 'antd';
import moment from 'moment';
import PostComment from "./CommentPost"

const { TextArea } = Input;

class Post extends Component {
    state = {
        isResponseOk: false,
        isLiked: this.props.isLiked,
        likes: this.props.likes,
        modalVisible: false,
        commentText: ""
    };

    postComment = () => {
        let comment = {
            post: {
                id: this.props.post.id
            },
            text: this.state.commentText
        }
        let bearer_token = sessionStorage.getItem("token");
        fetch("/api/Comment/addComment", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            },
            body: JSON.stringify(comment)
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
                        commentText: ""
                    })
                    this.props.getMyPosts(this.props.user.username);
                }
            })

    }

    handleCommentText = e => {

        let { name, value } = e.target;

        this.setState({
            [name]: value
        })
    }

    openComments = () => {
        this.setState({
            modalVisible: true
        })
    }

    closeModal = () => {
        this.setState({
            modalVisible: false
        })
    }

    handleLike = () => {
        let post = {
            id: this.props.post.id
        }
        let bearer_token = sessionStorage.getItem("token");
        fetch("/api/Like/likePost", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            },
            body: JSON.stringify(post)
        })
            .then(response => {
                if (response.ok) {
                    this.props.getMyPosts()
                }
                return response.json()
            })
            .then(data => console.log(data))
    };

    render() {
        const post = this.props.post;
        const user = this.props.user;
        const comments = this.props.comment;
        const actions = [
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon
                        style={{ fontSize: "16px" }}
                        type="like"
                        theme={this.props.isLiked ? 'filled' : 'outlined'}
                        onClick={this.handleLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>{this.props.likes}</span>
            </span>,
            <span key="comment-basic-like">
                <Tooltip title="Comment">
                    <Icon
                        style={{ fontSize: "16px" }}
                        type="message"
                        theme={comments.length ? 'filled' : 'outlined'}
                        onClick={this.openComments}
                    />
                </Tooltip>
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>{comments.length}</span>
            </span>
        ];

        return (
            <div>
                <Comment
                    actions={actions}
                    author={<div>
                        <b
                            className="text-dark"
                            style={{
                                fontSize: "18px"
                            }}>
                            {user !== undefined ? user.firstName + " " + user.lastName : post.userId.firstName + " " + post.userId.lastName}</b><p style={{
                                marginTop: -5,
                                color: "#9c9a9a"
                            }}>{user !== undefined ? "@" + user.username : "@" + post.userId.username}</p></div>}
                    avatar={
                        <Avatar

                            icon="user"
                            src={user !== undefined ? user.image : post.userId.image}
                            alt="user"
                        />
                    }
                    content={
                        <p id={`post${post.id}`} className="mt-4" style={{
                            fontSize: "20px"
                        }}>
                            {post.post}
                        </p>
                    }
                    datetime={
                        <Tooltip title={moment(post.date).format('YYYY-MM-DD HH:mm:ss')}>
                            <span style={{
                                fontSize: "13px"
                            }}>{moment(post.date).fromNow()}</span>
                        </Tooltip>
                    }
                >
                    {comments.length !== 0 ?
                        <div>
                            <Divider style={{ margin: "5px 0" }} />
                            <PostComment comment={comments[0]} user={user} />
                        </div>
                        : ""}
                    <Modal
                        title="POST COMMENT"
                        visible={this.state.modalVisible}
                        onCancel={this.closeModal}
                        footer={[
                            <TextArea
                                onChange={this.handleCommentText}
                                rows={3} name="commentText"
                                value={this.state.commentText}
                                autosize={false}
                                maxLength={150}
                            />,
                            <span className={this.state.commentText === 150 ? "mr-3 text-danger" : "mr-3"} >{this.state.commentText.length}</span>,
                            <Button
                                key="back"
                                disabled={this.state.commentText === ""}
                                onClick={this.postComment}
                                type="primary"
                            >
                                Post
                        </Button>
                        ]}
                    >
                        {/* <div className="text-center"> */}
                        <Comment
                            style={{
                                padding: "5px",
                                maxHeight: window.innerHeight - 350,
                                overflow: "auto"
                            }}
                            // actions={actions}
                            author={<div>
                                <b
                                    className="text-dark"
                                    style={{
                                        fontSize: "18px"
                                    }}>
                                    {user !== undefined ? user.firstName + " " + user.lastName : post.userId.firstName + " " + post.userId.lastName}</b><p style={{
                                        marginTop: -5,
                                        color: "#9c9a9a"
                                    }}>{user !== undefined ? "@" + user.username : "@" + post.userId.username}</p></div>}
                            avatar={
                                <Avatar
                                    icon="user"
                                    src={user !== undefined ? user.image : post.userId.image}
                                    alt="user"
                                />
                            }
                            content={
                                <p className="mt-4" style={{
                                    fontSize: "20px"
                                }}>
                                    {post.post}
                                </p>
                            }
                            datetime={
                                <Tooltip title={moment(post.date).format('YYYY-MM-DD HH:mm:ss')}>
                                    <span style={{
                                        fontSize: "13px"
                                    }}>{moment(post.date).fromNow()}</span>
                                </Tooltip>
                            }
                        >
                            {comments.length !== 0 ? comments.map((com, i) =>
                                <div key={"comment" + i}>
                                    <Divider style={{ margin: "5px 0" }} />
                                    <PostComment comment={com} user={this.props.user} />
                                </div>
                            ) : ""}
                        </Comment>

                        {/* </div> */}
                    </Modal>
                </Comment>
                {/* <Divider /> */}
            </div>
        );
    }
}

export default Post;