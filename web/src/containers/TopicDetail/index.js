import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Card, Button, message, BackTop, Icon, Tooltip } from 'antd';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';
import ReactQuill from 'react-quill';

import Comment from './../../components/Comment';
import Header from './../../components/Header';
import * as actions from './../../actions';
import './index.scss';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],       // toggled buttons
    ['blockquote', 'code-block'],                    // blocks
    [{ 'header': 1 }, { 'header': 2 }],              // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // lists
    [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
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

class TopicDetail extends Component {
  state = {
    content: '',
    replyId: undefined,
    commentId: undefined,
    is_collect: false,
    login_token: localStorage.getItem('login_token'),
    replyArr: [],
    upIndex: -1,
  }
  componentWillMount() {
    const { topic_detail, actions } = this.props;
    if (topic_detail) {
      actions.initTopic();
    }
  }
  componentWillReceiveProps(nextProps) {
    const { match, topic_detail, actions, getTopicDetailStatus, commitStatus, collectStatus, cancelStatus, upStatus, status, auth, delReplyStatus, deleteTopicStatus } = nextProps;
    if (getTopicDetailStatus !== this.props.getTopicDetailStatus && getTopicDetailStatus === 'succ') {
      const replyArr = topic_detail.replies.map(item => item.ups);
      this.setState({
        is_collect: topic_detail.is_collect,
        replyArr,
      })
      actions.getUserInfo(topic_detail.author.loginname);
    } else if (getTopicDetailStatus !== this.props.getTopicDetailStatus && getTopicDetailStatus === 'cantFind') {
      message.error('文章不存在!!!');
    }

    if (delReplyStatus !== this.props.delReplyStatus && delReplyStatus === 'succ') {
      actions.getTopicDetail(match.params.id);
    }

    if (commitStatus !== this.props.commitStatus && commitStatus === 'succ') {
      this.setState({
        content: '',
        replyId: undefined,
        commentId: undefined,
      })
      actions.getTopicDetail(match.params.id);
    }

    if (commitStatus !== this.props.commitStatus && commitStatus === 'notExist') {
      message.error('请先登陆');
    }

    if (this.props.collectStatus !== collectStatus && collectStatus === 'succ') {
      this.setState({
        is_collect: true,
      })
    }
    if (this.props.cancelStatus !== cancelStatus && cancelStatus === 'succ') {
      this.setState({
        is_collect: false,
      })
    }

    if (this.props.upStatus !== upStatus && upStatus === 'succ' && status === 'succ') {
      const { action } = nextProps.upAction;
      const { replyArr, upIndex } = this.state;
      if (action === 'up') {
        replyArr[upIndex].push(auth.id);
      } else if (action === 'down') {
        replyArr[upIndex].splice(replyArr[upIndex].indexOf(auth.id), 1);
      }
      this.setState({
        replyArr,
      })
    }

    if (match.params.id !== this.props.match.params.id) {
      actions.getTopicDetail(match.params.id);
      actions.noReply(match.params.id);
    }

    if (deleteTopicStatus !== this.props.deleteTopicStatus && deleteTopicStatus === 'succ') {
      message.success('删除成功');
      this.props.history.push('/');
    } else if (deleteTopicStatus !== this.props.deleteTopicStatus && deleteTopicStatus === 'cantFind') {
      message.error('文章已不存在');
    } else if (deleteTopicStatus !== this.props.deleteTopicStatus && deleteTopicStatus === 'netErr') {
      message.error('请检查网络或服务');
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    //这地方不优化内容多的话会奇卡无比，因为你一直改变state他就一直重绘，内容少还好，内容多就会重现传说中的“掉帧”现象=。=
    if (this.state.content !== nextState.content && !!nextState.content) {
      return false;
    } else {
      return true;
    }
  }
  componentDidMount() {
    const { actions, match, auth } = this.props;
    if (!auth.loginname && localStorage.getItem('login_token')) {
      actions.auth();
    }
    actions.getTopicDetail(match.params.id);
    actions.noReply(match.params.id);
  }
  changeContent = (value) => {
    this.setState({
      content: value,
    })
  }
  changeStatus = (reply_id, comment_id) => {
    this.setState({
      content: '',
      replyId: reply_id,
      commentId: comment_id,
    });
  }
  commit = (topic_id, reply_id) => {
    const { actions } = this.props;
    const { content } = this.state;
    if (!content) {
      message.error('内容不能为空');
      return false;
    }
    actions.commitComment(topic_id, content, reply_id);
  }
  collect = () => {
    const { actions, topic_detail } = this.props;
    const { is_collect, login_token } = this.state;
    const topic_id = topic_detail.id;

    if (!login_token) {
      message.error('收藏失败，请先登陆');
      return false;
    }

    if (is_collect) {
      actions.cancelCollect({ topic_id });
    } else {
      actions.collect({ topic_id });
    }
  }
  upReply = (reply_id, index) => {
    const { actions, upStatus } = this.props;
    if (upStatus !== 'pending') {
      actions.upReply(reply_id);
      this.setState({
        upIndex: index,
      })
    }
  }
  deleteReply = (author_id) => {
    const { actions } = this.props;
    actions.delReply(author_id);
  }
  deleteTopic = (topic_id) => {
    const { actions } = this.props;
    actions.deleteTopic(topic_id);
  }
  gotoEdit = (topic_id) => {
    this.props.history.push(`/edit-topic/${topic_id}`);
  }
  render() {
    const { topic_detail, info, getInfoStatus, auth, noReplyTopic, noReplyStatus, collectStatus, cancelStatus, commitStatus } = this.props;
    if (topic_detail) {
      topic_detail.create_time = moment(topic_detail.create_at).format('YYYY-MM-DD');
      if (topic_detail.tab === 'ask') {
        topic_detail.kind = '问答';
      } else if (topic_detail.tab === 'share') {
        topic_detail.kind = '分享';
      } else if (topic_detail.tab === 'job') {
        topic_detail.kind = '招聘';
      }
      if (topic_detail.good) topic_detail.level = '精品';
      if (topic_detail.top) topic_detail.level = '置顶';
    }
    return (
      <div className="detail-page">
        <BackTop />
        <Header backTo='/' back='首页' now='详情' />
        <div className="topic-detail">
          <div className="topic-info">
            {
              topic_detail
              ? <div>
                  <Card noHovering='false' title={
                    <div className="topic-header">
                      <div>
                        {topic_detail.level && <span className="topic-level">{topic_detail.level}</span>}
                        <span>{topic_detail.title}</span>
                      </div>
                      <Button type="primary" loading={collectStatus === 'pending' || cancelStatus === 'pending'} onClick={this.collect}>{this.state.is_collect ? '取消收藏' : '收藏'}</Button>
                    </div>
                  } bordered={false}>
                    <span className="info-item">{`发表于 ${topic_detail.create_time}`}</span>
                    <span className="info-item">{`作者 ${topic_detail.author.loginname} `}</span>
                    <span className="info-item">{`${topic_detail.visit_count} 次浏览`}</span>
                    <span className="info-item">{`来自 ${topic_detail.kind}`}</span>
                    {auth.id === topic_detail.author_id &&
                      <Tooltip title="删除该话题，不可撤销">
                        <a style={{ marginLeft: '20px' }} onClick={() => this.deleteTopic(topic_detail.id)}>
                          <Icon type="delete" style={{ fontSize: 18, color: '#000' }} />
                        </a>
                      </Tooltip>
                    }
                    {auth.id === topic_detail.author_id &&
                      <Tooltip title="编辑该话题">
                        <a style={{ marginLeft: '20px' }} onClick={() => this.gotoEdit(topic_detail.id)}>
                          <Icon type="edit" style={{ fontSize: 18, color: '#000' }} />
                        </a>
                      </Tooltip>
                    }
                  </Card>
                  <Card className="topic-item" noHovering='false'>
                    <ReactMarkdown className="markdown-body" source={topic_detail.content} />
                  </Card>
                  {
                    !!topic_detail.replies.length &&
                    <Card className="topic-item comment" title="评论" noHovering='false'>
                      {
                        topic_detail.replies.map((item, index) => (
                          <Comment
                            key={item.id}
                            info={item}
                            index={index}
                            commentId={this.state.commentId}
                            changeStatus={() => this.changeStatus(item.author_id, item.id)}
                            upReply={this.upReply}
                            ups={this.state.replyArr[index] || []}
                            is_up={this.state.replyArr[index] && this.state.replyArr[index].includes(auth.id)}
                            author={auth.id}
                            deleteReply={this.deleteReply}>
                            <ReactQuill
                              theme="snow"
                              modules={modules}
                              formats={formats}
                              defaultValue={`<a href="#/user-info/${item.author.loginname}">@${item.author.loginname}</href>`}
                              onChange={this.changeContent} />
                            <Button className="reply-btn" type="primary" loading={commitStatus === 'pending'} onClick={() => this.commit(topic_detail.id, this.state.replyId)}>回复</Button>
                          </Comment>
                        ))
                      }
                    </Card>
                  }
                  <Card className="topic-item" title='回复' noHovering='false'>
                    <ReactQuill
                      placeholder={'不要水...'}
                      theme="snow"
                      modules={modules}
                      formats={formats}
                      value={this.state.content}
                      onChange={this.changeContent} />
                    <Button className="reply-btn" type="primary" loading={commitStatus === 'pending'} onClick={() => this.commit(topic_detail.id)}>回复</Button>
                  </Card>
                </div>
                : <Card loading style={{ width: '100%' }}>
                    正在加载~
                  </Card>
            }
          </div>
          <div className="article">
            <Card noHovering='false' title="作者">
              {getInfoStatus === 'succ' && topic_detail ?
                <div>
                  <img style={{ width: '60px' }} src={info.avatar_url} alt="avatar"></img>
                  <p style={{ fontSize: '14px' }}>{info.loginname}</p>
                  {info.signature && <p style={{ fontSize: '18px' }}>{`"${info.signature}"`}</p>}
                </div>
                :
                (
                  getInfoStatus === 'NoData' ?
                    <div>用户已不存在</div>
                    :
                    <div>加载中...<Icon type="loading" /></div>
                )
              }
            </Card>
            <Card title="无人回复的话题" className="no-reply-item" noHovering='false'>
              {
                noReplyStatus === 'pending'
                  ? <div className="loading">
                      <Icon type="loading" style={{ fontSize: 35 }}/>
                    </div>
                  : (noReplyTopic.length
                    ? noReplyTopic.map(item => (
                      <div className="no-reply-topic" key={item.id}><Link to={`/topics/${item.id}`}>{item.title}</Link></div>
                    ))
                    : <div className="no-reply-topic">没有相应的话题</div>
                  )
              }
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
TopicDetail.propTypes = {
  actions: PropTypes.shape({
    getUserInfo: PropTypes.func,
    getTopicDetail: PropTypes.func,
    noReply: PropTypes.func,
    auth: PropTypes.func,
    commitComment: PropTypes.func,
    cancelCollect: PropTypes.func,
    collect: PropTypes.func,
    upReply: PropTypes.func,
    delReply: PropTypes.func,
    deleteTopic: PropTypes.func,
  }),
  topic_detail: PropTypes.object,
  getTopicDetailStatus: PropTypes.string,
  collectStatus: PropTypes.string,
  cancelStatus: PropTypes.string,
  noReplyStatus: PropTypes.string,
  upStatus: PropTypes.string,
  getInfoStatus: PropTypes.string,
  commitStatus: PropTypes.string,
  delReplyStatus: PropTypes.string,
  status: PropTypes.string,
  upAction: PropTypes.object,
  info: PropTypes.object,
  auth: PropTypes.object,
  deleteTopicStatus: PropTypes.string,
};

function mapStateToProps(state) {
  const props = {
    topic_detail: state.topic.topic_detail,
    getTopicDetailStatus: state.topic.getTopicDetailStatus,
    collectStatus: state.topic.collectStatus,
    cancelStatus: state.topic.cancelStatus,
    noReplyTopic: state.topic.noReplyTopic,
    noReplyStatus: state.topic.noReplyStatus,
    deleteTopicStatus: state.topic.deleteTopicStatus,
    upStatus: state.comment.upStatus,
    upAction: state.comment.upAction,
    info: state.user.info,
    getInfoStatus: state.user.getInfoStatus,
    commitStatus: state.comment.commitStatus,
    delReplyStatus: state.comment.delReplyStatus,
    status: state.auth.status,
    auth: state.auth.auth,
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TopicDetail));
