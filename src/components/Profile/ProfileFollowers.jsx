import React, { Component } from 'react';
import { Avatar, Button, Modal, List } from 'antd';
import { Link } from "react-router-dom";

class ProfileFollowers extends Component {

    state = {
        users: []
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.modalOption !== this.props.modalOption) {
            this.getFollowersFollowing(this.props.modalOption);
        }
    }

    componentDidMount() {
        this.getFollowersFollowing(this.props.modalOption);
    }

    getFollowersFollowing = (option) => {
        let username = window.location.pathname.split("/");
        let bearer_token = sessionStorage.getItem("token");
        let url;
        option === 1 ? url = "getFollowers" : url = "getFollowing"

        fetch(`/api/Following/${url}?username=${username[3]}`, {
            method: "get",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + bearer_token
            }
        })
            .then(response => response.json())
            .then(data => {
                let users = [];
                if (data[0] !== undefined && data[0].followed === null) {

                    this.setState(state => {
                        data.map(item => {
                            return users.push(item.follower)
                        })
                        return {
                            users
                        }
                    })
                }
                else {
                    this.setState(state => {
                        data.map(item => {
                            return users.push(item.followed)
                        })
                        return {
                            users
                        }
                    })
                }
            })
    }

    render() {
        let visibleModal = this.props.visibleModal;
        //if this is 1 then it will show followers, else it will show following
        let modalOption = this.props.modalOption;
        return (
            <Modal
                title={modalOption === 1 ? "FOLLOWERS" : "FOLLOWING"}
                visible={visibleModal}
                onCancel={this.props.closeFollowersModal}
                footer={[
                    <Button key="back" onClick={this.props.closeFollowersModal}>
                        Close
                    </Button>
                ]}
            >
                <List
                    loading={this.props.modalOption === null}
                    dataSource={this.state.users}
                    renderItem={item =>

                        <List.Item >
                            <Avatar
                                src={item.image}
                                icon="user"
                                size={50}
                            />
                            <Link
                                style={{ color: "inherit" }}
                                to={`/Home/user/${item.username}`}
                                onClick={() => {
                                    this.props.closeFollowersModal();
                                    setTimeout(() => {
                                        this.props.loadUser();
                                    }, 500)

                                }}>
                                <div className="ml-3">
                                    <b>{item.firstName + " " + item.lastName}</b>
                                    <br />
                                    <p style={{ marginTop: "-8px" }}>{"@" + item.username}</p>
                                </div>
                            </Link>
                        </List.Item>
                    }
                />
            </Modal>
        );
    }
}

export default ProfileFollowers;