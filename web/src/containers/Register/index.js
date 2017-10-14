import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { message, Form, Input, Tooltip, Icon, Row, Col, Checkbox, Button } from 'antd';
import md5 from 'md5';

import Steps from './../../components/Steps';
import Header from './../../components/Header';
import * as actions from './../../actions';
import './index.scss';

const FormItem = Form.Item;

const steps = [
  { title: '填写你的信息', finshed: true },
  { title: '信息为真', finshed: false },
  { title: '验证通过', finshed: false },
  { title: '成为马猴烧酒', finshed: false },
  { title: '拯救人类', finshed: false },
]

class Register extends Component {
  componentWillReceiveProps(nextprops) {
    if (this.props.registerStatus !== nextprops.registerStatus && nextprops.registerStatus === 'succ') {
      this.props.history.push("/");
    } else if (this.props.registerStatus !== nextprops.registerStatus && nextprops.registerStatus === 'userErr') {
      message.info('登陆名已经存在');
    } else if (this.props.registerStatus !== nextprops.registerStatus && nextprops.registerStatus === 'netrErr') {
      message.info('网络错误');
    }
  }
  state = {
    confirmDirty: false,
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!values.agreement) {
        message.info('请确定是否是真实信息');
        return false;
      }
      if (!err) {
        const { actions } = this.props;
        actions.register({
          loginname: values.login,
          email: values.email,
          password: md5(values.password),
          web: values.web,
          signature: values.signature,
        });
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { registerStatus } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
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
          offset: 6,
        },
      },
    };

    return (
      <div className="register-page">
        <Header backTo='/' back='首页' now='注册' />
        <div className="register-content">
          <Steps steps={steps} />
          <Form onSubmit={this.handleSubmit} className="register-form">
            <FormItem
              {...formItemLayout}
              label="E-mail"
              hasFeedback
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: '就问你，是邮箱啊！',
                }],
              })(
                <Input />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Password"
              hasFeedback
            >
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '不要密码了啊!',
                }, {
                  validator: this.checkConfirm,
                }],
              })(
                <Input type="password" />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Confirm Password"
              hasFeedback
            >
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: '你是鱼嘛',
                }, {
                  validator: this.checkPassword,
                }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  登陆名&nbsp;
                  <Tooltip title="这是你的登陆名，记住了啊！">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
              hasFeedback
            >
              {getFieldDecorator('login', {
                rules: [{ required: true, message: '呃', whitespace: true }],
              })(
                <Input />
                )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="个人网站"
            >
              {getFieldDecorator('web')(
                <Input type="text" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="个性签名"
            >
              {getFieldDecorator('signature')(
                <Input type="text" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="Captcha"
              extra="我们需要确定你不是智障，随便输点什么"
            >
              <Row gutter={8}>
                <Col span={12}>
                  {getFieldDecorator('captcha', {
                    rules: [{ required: true, message: '你是白痴嘛！' }],
                  })(
                    <Input size="large" />
                    )}
                </Col>
                <Col span={12}>
                </Col>
              </Row>
            </FormItem>
            <FormItem {...tailFormItemLayout} style={{ marginBottom: 8 }}>
              {getFieldDecorator('agreement', {
                valuePropName: 'checked',
              })(
                <Checkbox>以上信息都为真实信息</Checkbox>
                )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit" loading={registerStatus === 'pending'}>注册</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  actions: PropTypes.shape({
    register: PropTypes.func,
  }),
  registerStatus: PropTypes.string,
};

const WrappedRegistrationForm = Form.create()(Register);

function mapStateToProps(state) {
  const props = {
    registerStatus: state.user.registerStatus,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedRegistrationForm));
