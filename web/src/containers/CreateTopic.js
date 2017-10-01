import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Input, Button, Select } from 'antd';
//import axios from 'axios';
import ReactQuill from 'react-quill';

import * as actions from './../actions';
import Header from './../components/Header';

const FormItem = Form.Item;
const Option = Select.Option;

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
    ['blockquote', 'code-block'],                    // blocks
    [{ 'header': 1 }, { 'header': 2 }],              // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],    // lists
    [{ 'script': 'sub'}, { 'script': 'super' }],     // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],         // outdent/indent
    [{ 'direction': 'rtl' }],                        // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],       // header dropdown
    [{ 'color': [] }, { 'background': [] }],         // dropdown with defaults
    [{ 'font': [] }],                                // font family
    [{ 'align': [] }], 
    ['link', 'image'],                              // text align
    ['clean'],
  ],
}

const formats = [
  'header', 'font', 'background', 'color', 'code', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'script', 'align', 'direction',
  'link', 'image', 'code-block', 'formula', 'video'
]

/**
function uploadImageCallBack(file) {
  console.log(file);
  var formdata = new FormData();
  formdata.append('file', file);
  axios.post(`/api/topic/upload`, formdata).then(({ data }) => {
    console.log(data);
  })
}
*/

class CreateTopic extends Component {
  state = {
    text: '',
  }
  handleChange = value => {
    this.setState({
      text: value,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { actions } = this.props;
        actions.createTopic({
          tab: values.tab,
          title: values.title,
          content: this.state.text,
        })
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.createTopicStatus !== this.props.createTopicStatus && nextProps.createTopicStatus === 'succ') {
      this.props.history.push('/');
    }
  }
  render() {
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
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Header backTo='/' back='首页' now='创建' />
        <Form style={{ padding: '20px 200px', backgroundColor: '#fff' }} onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="选择板块："
          >
            {getFieldDecorator('tab', {
              initialValue: 'ask',
            })(
              <Select>
                <Option value="ask">问答</Option>
                <Option value="share">分享</Option>
                <Option value="job">招聘</Option>
              </Select>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="标题字数 十字以上"
            hasFeedback
          >
            {getFieldDecorator('title', {
              rules: [
                { required: true, message: '请输入标题!', whitespace: true },
                { min: 10, message: '字数不能少于十字' },
              ],
            })(
              <Input />
              )}
          </FormItem>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={this.state.text}
            onChange={this.handleChange} />
          <FormItem style={{ margin: '20px 40px' }}>
            <Button type="primary" htmlType="submit">提交</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
CreateTopic.propTypes = {
  actions: PropTypes.shape({
    createTopic: PropTypes.func,
  }),
  createTopicStatus: PropTypes.string,
};

const CreateTopicCom = Form.create()(CreateTopic);

function mapStateToProps(state) {
  const props = {
    createTopicStatus: state.topic.createTopicStatus,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateTopicCom));
