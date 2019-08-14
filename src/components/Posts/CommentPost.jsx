import React, { Component } from 'react';
import { Comment, Icon, Tooltip, Avatar } from 'antd';
import moment from 'moment';

class PostComment extends Component {
    state = {}
    render() {
        const com = this.props.comment;
        const user = this.props.user;
        return (
            <Comment
                style={{
                    padding: "5px"
                }}
                author={<div>
                    <b
                        className="text-dark"
                        style={{
                            fontSize: "18px"
                        }}>
                        {com.isMy ? user !== undefined && user !== null ? user.firstName + " " + user.lastName : com.user.firstName + " " + com.user.lastName : com.user.firstName + " " + com.user.lastName}</b><p style={{
                            marginTop: -5,
                            color: "#9c9a9a"
                        }}>{com.isMy ? user !== undefined ? "@" + user.username : "@" + com.user.username : "@" + com.user.username}</p></div>}
                avatar={
                    <Avatar
                        icon="user"
                        src={com.isMy ? user !== undefined ? user.image : com.user.image : com.user.image}
                        alt="user"
                    />
                }
                content={
                    <p className="mt-4" style={{
                        fontSize: "20px"
                    }}>
                        {com.text}
                    </p>
                }
                datetime={
                    <Tooltip title={moment(com.date).format('YYYY-MM-DD HH:mm:ss')}>
                        <span style={{
                            fontSize: "13px"
                        }}>{moment(com.date).fromNow()}</span>
                    </Tooltip>
                }
            />
        );
    }
}

export default PostComment;