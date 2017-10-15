import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Input, Button, message, Card } from 'antd';
import md5 from 'md5';

import Header from './../../components/Header';
import * as actions from './../../actions';
import './index.scss';

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

class Setting extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { actions, updateStatus } = nextProps;
    if (updateStatus !== this.props.updateStatus && nextProps.updateStatus === 'succ') {
      message.success('更新成功');
      actions.auth();
    }
  }
  componentDidMount() {
    const { actions, auth } = this.props;
    if (!auth.id) actions.auth();
  }
  saveSetting = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { actions } = this.props;
        actions.updateSetting(values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { auth, updateStatus } = this.props;
    return (
      <Form onSubmit={this.saveSetting} className="setting-form">
        <FormItem
          {...formItemLayout}
          label="登陆名"
          hasFeedback
        >
          {getFieldDecorator('loginname', {
            rules: [{
              required: true, message: '不能为空!',
            }],
            initialValue: auth.loginname,
          })(
            <Input disabled/>
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
            initialValue: auth.email,
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
            initialValue: auth.web,
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
            initialValue: auth.signature,
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={updateStatus === 'pending'}>保存设置</Button>
        </FormItem>
      </Form>
    );
  }
}
const SettingForm = Form.create()(Setting);

class Pass extends React.Component {
  state = {
    confirmDirty: false,
  }
  componentWillReceiveProps(nextProps) {
    const { changeStatus } = nextProps;
    if (changeStatus !== this.props.changeStatus && changeStatus === 'errPass') {
      message.error('原始密码错误');
    } else if (changeStatus !== this.props.changeStatus && changeStatus === 'succ') {
      message.success('修改成功');
      localStorage.removeItem('login_token');
      this.props.history.push('/login');
    } else if (changeStatus !== this.props.changeStatus && changeStatus === 'netErr') {
      message.error('网络错误');
    }
  }
  changePass = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { actions } = this.props;
        actions.changePass({
          oldpass: md5(values.oldpass),
          newpass: md5(values.newpass),
        });
      }
    });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value === form.getFieldValue('oldpass')) {
      callback('新旧密码不能相同!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['newpass'], { force: true });
    }
    callback();
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { changeStatus } = this.props;
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
            }, {
              validator: this.checkConfirm,
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
            },  {
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" onBlur={this.handleConfirmBlur}/>
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={changeStatus === 'pending'}>更改密码</Button>
        </FormItem>
      </Form>
    );
  }
}
const PassForm = Form.create()(Pass);

PassForm.propTypes = {
  actions: PropTypes.shape({
    auth: PropTypes.func,
    updateSetting: PropTypes.func,
  }),
  status: PropTypes.string,
  updateStatus: PropTypes.string,
  changeStatus: PropTypes.string,
  auth: PropTypes.object,
};
SettingForm.propTypes = {
  actions: PropTypes.shape({
    auth: PropTypes.func,
    changePass: PropTypes.func,
  }),
  status: PropTypes.string,
  updateStatus: PropTypes.string,
  changeStatus: PropTypes.string,
  auth: PropTypes.object,
};

function mapStateToProps(state) {
  const props = {
    status: state.user.loginStatus,
    auth: state.auth.auth,
    updateStatus: state.user.updateStatus,
    changeStatus: state.user.changeStatus,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
const Frist = withRouter(connect(mapStateToProps, mapDispatchToProps)(SettingForm));
const Second = withRouter(connect(mapStateToProps, mapDispatchToProps)(PassForm));

export default class Settings extends React.Component {
  render() {
    return (
      <div className="setting-page">
        <Header backTo='/' back='首页' now='设置'/>
        <div className="content">
          <Card className="setting-card" noHovering='false' title="基本设置">
            <Frist />
          </Card>
          <Card className="setting-card" noHovering='false' title="更改密码">
            <Second />
          </Card>
        </div>
      </div>
    );
  }
};