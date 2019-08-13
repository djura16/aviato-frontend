import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
import HomeContent from "./HomeContent"

const { Header, Content, Footer, Sider } = Layout;

class Home extends Component {
    state = {}
    render() {
        return (
            <Layout>
                <Sider
                    breakpoint="md"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
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
                            <Icon type="home" />
                            <span className="nav-text">Home</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="user" />
                            <span className="nav-text">Profile</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <HomeContent></HomeContent>
            </Layout>
        );
    }
}

export default Home;