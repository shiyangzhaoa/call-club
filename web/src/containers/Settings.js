import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Icon, Input, Button, notification, Card } from 'antd';

import Header from './../components/Header';
import * as actions from './../actions';
import './settings.scss';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 4,
    },
  },
};

class Pass extends React.Component {
  changePass = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.changePass} className="setting-form">
        <FormItem
          {...formItemLayout}
          label="当前密码"
          hasFeedback
        >
          {getFieldDecorator('oldpass', {
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback
        >
          {getFieldDecorator('newpass', {
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <Input type="password" />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">更改密码</Button>
        </FormItem>
      </Form>
    );
  }
}
const PassForm = Form.create()(Pass);

class Setting extends React.Component {
  saveSetting = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.saveSetting} className="setting-form">
        <FormItem
          {...formItemLayout}
          label="登陆名"
          hasFeedback
        >
          {getFieldDecorator('username', {
            rules: [{
              required: true, message: '不能为空!',
            }],
          })(
            <Input disabled />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="电子邮件"
          hasFeedback
        >
          {getFieldDecorator('email', {
            rules: [{
              required: true, message: '不能为空!',
            }, {
              type: 'email', message: '格式不正确',
            }],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="个人网站"
        >
          {getFieldDecorator('web', {
            rules: [],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="个性签名"
        >
          {getFieldDecorator('signature', {
            rules: [],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">保存设置</Button>
        </FormItem>
      </Form>
    );
  }
}
const SettingForm = Form.create()(Setting);

class Settings extends React.Component {
  componentWillReceiveProps(nextprops) {
  }
  render() {
    return (
      <div className="setting-page">
        <Header backTo='/' back='首页' now='设置'/>
        <div className="content">
          <Card className="setting-card" noHovering='false' title="基本设置">
            <SettingForm />
          </Card>
          <Card className="setting-card" noHovering='false' title="更改密码">
            <PassForm />
          </Card>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  actions: PropTypes.shape({
    login: PropTypes.func,
  }),
  loginStatus: PropTypes.string,
};

function mapStateToProps(state) {
  const props = {
    loginStatus: state.user.loginStatus,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));
