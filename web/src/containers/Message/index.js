import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card, Button, message } from 'antd';

import NavBar from './../../components/NavBar';
import * as actions from './../../actions';
import './index.scss';

class Message extends Component {
  componentWillReceiveProps(nextProps) {
    const { actions, markAllStatus, markOneStatus } = nextProps;
    if (markAllStatus !== this.props.markAllStatus && markAllStatus === 'succ') {
      actions.getMessages();
      actions.getMessageCount();
    }
    if (markOneStatus !== this.props.markOneStatus && markOneStatus === 'succ') {
      actions.getMessages();
    }
  }
  componentDidMount() {
    const { actions } = this.props;
    actions.getMessages();
  }
  readMessage = (topic_id, msg_id) => {
    const { actions } = this.props;
    msg_id && actions.markOne(msg_id);
    topic_id && this.props.history.push(`/topics/${topic_id}`);
  }
  markAll = () => {
    const { actions, messages } = this.props;
    if (messages.data.has_not_read_messages.length) {
      actions.markAll();
    } else {
      message.error('无未读消息');
    } 
  }
  render() {
    const has_read_messages = this.props.messages && this.props.messages.data.has_read_messages;
    const has_not_read_messages = this.props.messages && this.props.messages.data.has_not_read_messages;
    return (
      <NavBar>
        <div className="message-page">
          <div>
            <Button className="mark-btn" type="primary" size="large" onClick={this.markAll}>标记全部为已读</Button>
          </div>
          <Card className="info-card" noHovering='false' title="未读的消息">
            <ul>
              {has_not_read_messages ?
                (has_not_read_messages.length ? has_not_read_messages.map(item => (
                  <li key={item.id} className="message-item">
                    {
                      item.type === 'comment' ?
                        <div>
                          <span>有人在你发表的<a className="topic-link" onClick={() => this.readMessage(item.topic.id, item.id)}>{item.topic.title || '（文章已经删除）'}</a>中评论了你</span>
                        </div>
                        : <div>有人在文章<a className="topic-link" onClick={() => this.readMessage(item.topic.id, item.id)}>{item.topic.title || '（文章已经删除）'}</a>中@了你</div>
                    }
                  </li>
                ))
                  : <li className="message-item">暂无消息</li>)
                : <li className="message-item">正在加载...</li>
              }
            </ul>
          </Card>
          <Card className="info-card" noHovering='false' title="过往消息">
            <ul>
              {has_read_messages
                ? (has_read_messages.length
                  ? has_read_messages.map(item => (
                      <li key={item.id} className="message-item">
                        {
                          item.type === 'comment'
                          ? <div>
                              <span>有人在你发表的<a className="topic-link" onClick={() => this.readMessage(item.topic.id)}>{item.topic.title || '（文章已经删除）'}</a>中评论了你</span>
                            </div>
                          : <div>有人在文章<a className="topic-link" onClick={() => this.readMessage(item.topic.id)}>{item.topic.title || '（文章已经删除）'}</a>中@了你</div>
                        }
                      </li>
                    ))
                  : <li className="message-item">暂无消息</li>)
                : <li className="message-item">正在加载...</li>
              }
            </ul>
          </Card>
        </div>
      </NavBar>
    );
  }
}

Message.propTypes = {
  actions: PropTypes.shape({
    getMessages: PropTypes.func,
    markOne: PropTypes.func,
    markAll: PropTypes.func,
  }),
  getMessageStatus: PropTypes.string,
  messages: PropTypes.object,
  markOneStatus: PropTypes.string,
  markAllStatus: PropTypes.string,
};

function mapStateToProps(state) {
  const props = {
    getMessageStatus: state.message.getMessageStatus,
    messages: state.message.messages,
    markOneStatus: state.message.markOneStatus,
    markAllStatus: state.message.markAllStatus,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Message));
