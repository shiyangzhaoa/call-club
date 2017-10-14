import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Icon, Input, Button, notification } from 'antd';
import md5 from 'md5';

import './index.scss';
import Steps from './../../components/Steps';
import Header from './../../components/Header';
import * as actions from './../../actions';

const steps = [
  { title: '登陆', finshed: true },
  { title: '评论', finshed: false },
  { title: '创建', finshed: false },
]

const FormItem = Form.Item;
/* Populated by react-webpack-redux:reducer */
class Login extends React.Component {
  componentWillReceiveProps(nextprops) {
    if (this.props.loginStatus !== nextprops.loginStatus && nextprops.loginStatus === 'succ') {
      this.props.history.push("/");
    }
    if (this.props.loginStatus !== nextprops.loginStatus && nextprops.loginStatus === 'passErr') {
      notification.open({
        message: '密码错误',
        description: '很严重的错误，我想很可能是你输错密码了~',
        style: {
          width: 300,
          marginLeft: 335 - 300,
        },
      });
    } else if(this.props.loginStatus !== nextprops.loginStatus && nextprops.loginStatus === 'userErr') {
      notification.open({
        message: '用户不存在',
        description: '请检查用户名，这个应该不是我们这边的...',
        style: {
          width: 300,
          marginLeft: 335 - 300,
        },
      });
    } else if(this.props.loginStatus !== nextprops.loginStatus && nextprops.loginStatus === 'netErr') {
      notification.open({
        message: '网络错误',
        description: '如果是我的服务器挂了，这个锅我背，也有可能是你没有连接网络.',
        style: {
          width: 400,
          marginLeft: 335 - 400,
        },
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { actions } = this.props;
        actions.login({
          loginname: values.loginname,
          password: md5(values.password),
        });
      }
    });
  }
  forgot = () => {
    notification.open({
      message: '你在开玩喜？',
      description: '密码丢了就丢了，请联系管理员...',
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loginStatus } = this.props;
    return (
      <div>
        <Header backTo='/' back='首页' now='登陆'/>
        <div className="login-page">
          <Steps steps={steps}/>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator('loginname', {
                rules: [{ required: true, message: 'Please input your loginname!' }],
              })(
                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="loginname" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              <div className="form-ctrl">
                <div>
                  <a className="login-form-forgot" onClick={this.forgot}>Forgot password</a>
                </div>
                <Button type="primary" htmlType="submit" className="login-form-button" loading={loginStatus === 'pending'}>
                  登陆
                </Button>
              </div>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}
/* Populated by react-webpack-redux:reducer
 *
 * HINT: if you adjust the initial type of your reducer, you will also have to
 *       adjust it here.
 */
Login.propTypes = {
  actions: PropTypes.shape({
    login: PropTypes.func,
  }),
  loginStatus: PropTypes.string,
};

const LoginForm = Form.create()(Login);

function mapStateToProps(state) { // eslint-disable-line no-unused-vars
  const props = {
    loginStatus: state.user.loginStatus,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));
