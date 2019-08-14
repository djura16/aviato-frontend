import React, { Component } from 'react';
import { Comment, Icon, Tooltip, Avatar, Divider } from 'antd';
import moment from 'moment';
import PostComment from "./CommentPost"

class Post extends Component {
    state = {
        isResponseOk: false,
        isLiked: this.props.isLiked,
        likes: this.props.likes
    };

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
                    this.setState(prevState => ({
                        isLiked: !prevState.isLiked,
                        likes: prevState.isLiked ? prevState.likes - 1 : prevState.likes + 1
                    }));
                }
                return response.json()
            })
            .then(data => console.log(data))
    };

    render() {
        const post = this.props.post;
        const user = this.props.user;
        const comments = this.props.comment;
        console.log(comments);
        const actions = [
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon
                        type="like"
                        theme={this.state.isLiked ? 'filled' : 'outlined'}
                        onClick={this.handleLike}
                    />
                </Tooltip>
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>{this.state.likes}</span>
            </span>,
            <span key="comment-basic-reply-to">Reply to</span>,
        ];

        return (
            <Comment
                style={{
                    border: "2px solid #e4e4e4",
                    backgroundColor: "#fff",
                    borderRadius: "20px",
                    padding: "5px"
                }}
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

                {comments !== [] ? comments.map(com =>
                    <div>
                        <Divider style={{ margin: "5px 0" }} />
                        <PostComment comment={com} user={user} />
                    </div>
                ) : ""}

            </Comment>
        );
    }
}

export default Post;