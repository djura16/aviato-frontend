import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

class HomeContent extends Component {
    state = {}
    render() {
        return <Layout>
            <Header style={{ background: '#fff', padding: 0, marginLeft: 200 }}>
                <h1>Home</h1>
            </Header>
            <Content style={{ margin: '24px 16px 0', marginLeft: 200 }}>
                <div style={{ padding: 24, background: '#fff', height: window.innerHeight - 158 }}>content</div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Twitter by Quantox ©2019 Created by Aviato</Footer>
        </Layout>;
    }
}

export default HomeContent;