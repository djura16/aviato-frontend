import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

class HomeContent extends Component {
    state = {}
    render() {
        let onPhone = this.props.onPhone;
        return <Layout>
            <Header id="header" style={{ background: '#fff', padding: 0, marginLeft: onPhone ? "81px" : "200px" }}>
                <h1>Home</h1>
            </Header>
            <Content id="content" style={{ margin: '24px 16px 0', marginLeft: onPhone ? "81px" : "200px" }} >
                <div style={{ padding: 24, background: '#fff', height: window.innerHeight - 158 }}>content</div>
            </Content>
            <Footer id="footer" style={{ textAlign: 'center', marginLeft: onPhone ? "81px" : "200px" }}>Twitter Quantox ©2019 Created by Aviato</Footer>
        </Layout>;
    }
}

export default HomeContent;