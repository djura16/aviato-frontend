import React, { Component } from 'react';
import { Comment, Icon, Tooltip, Avatar } from 'antd';
import moment from 'moment';

class Post extends Component {
    state = {
        likes: 0,
        dislikes: 0,
        action: null,
    };

    like = () => {
        this.setState({
            likes: 1,
            dislikes: 0,
            action: 'liked',
        });
    };

    dislike = () => {
        this.setState({
            likes: 0,
            dislikes: 1,
            action: 'disliked',
        });
    };

    render() {
        let post = this.props.post;
        const { likes, dislikes, action } = this.state;

        const actions = [
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    <Icon
                        type="like"
                        theme={action === 'liked' ? 'filled' : 'outlined'}
                        onClick={this.like}
                    />
                </Tooltip>
                <span style={{ paddingLeft: 8, cursor: 'auto' }}>{likes}</span>
            </span>,
            // <span key=' key="comment-basic-dislike"'>
            //     <Tooltip title="Dislike">
            //         <Icon
            //             type="dislike"
            //             theme={action === 'disliked' ? 'filled' : 'outlined'}
            //             onClick={this.dislike}
            //         />
            //     </Tooltip>
            //     <span style={{ paddingLeft: 8, cursor: 'auto' }}>{dislikes}</span>
            // </span>,
            <span key="comment-basic-reply-to">Reply to</span>,
        ];

        return (
            <Comment
                // style={{
                //     border: "2px solid #e4e4e4",
                //     borderRadius: "20px",
                //     padding: "5px"
                // }}
                actions={actions}
                author={<div><h6><b>{post.userId.firstName + " " + post.userId.lastName}</b></h6><p style={{
                    marginTop: -10,
                    color: "#9c9a9a"
                }}>{"@" + post.userId.username}</p></div>}
                avatar={
                    <Avatar
                        icon="user"
                        src={post.userId.image}
                        alt="Han Solo"
                    />
                }
                content={
                    <p className="mt-4">
                        {post.post}
                    </p>
                }
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment(post.date).fromNow()}</span>
                    </Tooltip>
                }
            />
        );
    }
}

export default Post;