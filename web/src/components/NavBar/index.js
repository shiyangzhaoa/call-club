import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as actions from './../../actions';

import './index.scss';

const { Content, Footer, Sider, Header } = Layout;
const SubMenu = Menu.SubMenu;

class NavBar extends Component {
  state = {
    collapsed: true,
    hasLogin: false,
  }
  componentDidMount() {
    const { actions, auth } = this.props;
    const token = localStorage.getItem('login_token');
    if (token) {
      this.setState({
        hasLogin: true
      })
      actions.getMessageCount();
      if (!auth.id) actions.auth();
    }
  }
  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  selectTab = ({ key }) => {
    const { auth } = this.props;
    switch (key) {
      case 'home':
        this.props.history.push("/");
        break;
      case 'register':
        this.props.history.push("/register");
        break;
      case 'login':
        this.props.history.push("/login");
        break;
      case 'userInfo':
        this.props.history.push(`/user-info/${auth.loginname}`);
        break;
      case 'createTopic':
        this.props.history.push("/create-topic");
        break;
      case 'signout':
        localStorage.removeItem('login_token');
        const { actions } = this.props;
        actions.userExit();
        this.props.history.push("/");
        this.setState({
          hasLogin: false,
        })
        break;
      case 'good':
        this.props.history.push("/category/good");
        break;
      case 'share':
        this.props.history.push("/category/share");
        break;
      case 'ask':
        this.props.history.push("/category/ask");
        break;
      case 'job':
        this.props.history.push("/category/job");
        break;
      case 'message':
        this.props.history.push("/message");
        break;
      case 'setting':
        this.props.history.push("/setting");
        break;
      default:
        return false;
    }
  }
  render() {
    const { match, count } = this.props;
    const { params: { categorySlug } } = match;
    let pageNow;
    if (categorySlug === 'good') {
      pageNow = '精华';
    } else if(categorySlug === 'share') {
      pageNow = '分享';
    } else if(categorySlug === 'ask') {
      pageNow = '问答';
    } else if(categorySlug === 'job') {
      pageNow = '招聘';
    } else if (match.url === '/message') {
      pageNow = '消息'
    }
    if (match.path === '/user-info/:loginname') {
      pageNow = '个人信息';
    }
    return (
      <Layout className="nav-bar">
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          className="pc"
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onSelect={this.selectTab}>
            <Menu.Item key="home"  className={(match.path === '/' || match.path === '/page/:pageNum?' || match.params.categorySlug === 'all') && 'ant-menu-item-selected'}>
              <Icon type="home" />
              <span>首页</span>
            </Menu.Item>
            {this.state.hasLogin && (
              <Menu.Item className={match.url === '/message' && 'ant-menu-item-selected'} key="message">
                <Icon type="notification" />
                <span>消息</span>
                {
                  !!count && 
                  <span style={{ padding: "2px 8px", backgroundColor: "#A9BBDC", marginLeft: '40px', lineHeight: '9px', borderRadius: '30px' }}>{count}</span>
                }
              </Menu.Item>
            )}
            <SubMenu
              key="sub1"
              title={<span><Icon type="tag-o" /><span>分类</span></span>}
            >
              <Menu.Item key="good" className={match.params.categorySlug === 'good' && 'ant-menu-item-selected'}>精华</Menu.Item>
              <Menu.Item key="share" className={match.params.categorySlug === 'share' && 'ant-menu-item-selected'}>分享</Menu.Item>
              <Menu.Item key="ask" className={match.params.categorySlug === 'ask' && 'ant-menu-item-selected'}>问答</Menu.Item>
              <Menu.Item key="job" className={match.params.categorySlug === 'job' && 'ant-menu-item-selected'}>招聘</Menu.Item>
            </SubMenu>
            {!this.state.hasLogin && (
              <Menu.Item key="login">
                <Icon type="login" />
                <span>登陆</span>
              </Menu.Item>
            )}
            {!this.state.hasLogin && (
              <Menu.Item key="register">
                <Icon type="plus-circle-o" />
                <span>注册</span>
              </Menu.Item>
            )}
            {this.state.hasLogin && (
              <Menu.Item key="userInfo" className={match.path === '/user-info/:loginname' && 'ant-menu-item-selected'}>
                <Icon type="user" />
                <span>个人信息</span>
              </Menu.Item>
            )}
            {this.state.hasLogin && (
              <SubMenu
              key="sub2"
              title={<span><Icon type="setting" /><span>操作</span></span>}
            >
                <Menu.Item key="createTopic">创建新话题</Menu.Item>
                <Menu.Item key="setting">设置</Menu.Item>
                <Menu.Item key="signout">退出</Menu.Item>
              </SubMenu>
            )}
          </Menu>
        </Sider>
        <Header className="mobile">
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="horizontal" onSelect={this.selectTab} className="menu">
            <Menu.Item key="home"  className={(match.path === '/' || match.path === '/page/:pageNum?' || match.params.categorySlug === 'all') && 'ant-menu-item-selected'}>
              <Icon type="home" />
              <span>首页</span>
            </Menu.Item>
            {this.state.hasLogin && (
              <Menu.Item className={match.url === '/message' && 'ant-menu-item-selected'} key="message">
                <Icon type="notification" />
                <span>消息</span>
                {
                  !!count && 
                  <span style={{ display: 'inline-block', padding: "3px 8px", backgroundColor: "#A9BBDC", marginLeft: '40px', lineHeight: '9px', borderRadius: '30px' }}>{count}</span>
                }
              </Menu.Item>
            )}
            <SubMenu
              key="sub1"
              title={<span><Icon type="tag-o" /><span>分类</span></span>}
            >
              <Menu.Item key="good" className={match.params.categorySlug === 'good' && 'ant-menu-item-selected'}>精华</Menu.Item>
              <Menu.Item key="share" className={match.params.categorySlug === 'share' && 'ant-menu-item-selected'}>分享</Menu.Item>
              <Menu.Item key="ask" className={match.params.categorySlug === 'ask' && 'ant-menu-item-selected'}>问答</Menu.Item>
              <Menu.Item key="job" className={match.params.categorySlug === 'job' && 'ant-menu-item-selected'}>招聘</Menu.Item>
            </SubMenu>
            {!this.state.hasLogin && (
              <Menu.Item key="login">
                <Icon type="login" />
                <span>登陆</span>
              </Menu.Item>
            )}
            {!this.state.hasLogin && (
              <Menu.Item key="register">
                <Icon type="plus-circle-o" />
                <span>注册</span>
              </Menu.Item>
            )}
            {this.state.hasLogin && (
              <Menu.Item key="userInfo" className={match.path === '/user-info/:loginname' && 'ant-menu-item-selected'}>
                <Icon type="user" />
                <span>个人信息</span>
              </Menu.Item>
            )}
            {this.state.hasLogin && (
              <SubMenu
              key="sub2"
              title={<span><Icon type="setting" /><span>操作</span></span>}
            >
                <Menu.Item key="createTopic">创建新话题</Menu.Item>
                <Menu.Item key="setting">设置</Menu.Item>
                <Menu.Item key="signout">退出</Menu.Item>
              </SubMenu>
            )}
          </Menu>
        </Header>
        <Layout>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '12px 0' }}>
              <Breadcrumb.Item>全部</Breadcrumb.Item>
              <Breadcrumb.Item>{pageNow}</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360, color: '#000' }}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Created by shiyangzhaoa ©2017
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

NavBar.propTypes = {
  actions: PropTypes.shape({
    getMessageCount: PropTypes.func,
    auth: PropTypes.func,
  }),
  auth: PropTypes.object,
  messageCountStatus: PropTypes.string,
  count: PropTypes.number,
};
function mapStateToProps(state) {
  const props = {
    auth: state.auth.auth,
    messageCountStatus: state.message.messageCountStatus,
    count: state.message.count,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));

