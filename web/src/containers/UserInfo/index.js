import React, {
  Component,
} from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Card } from 'antd';
import moment from 'moment';
import { Link } from 'react-router-dom';

import NavBar from './../../components/NavBar';
import * as actions from './../../actions';
import './index.scss';

class UserInfo extends Component {
  componentWillReceiveProps(nextProps) {
    const { actions, match } = this.props;
    const loginNext = nextProps.match.params.loginname;
    const loginNow = match.params.loginname;
    if (loginNext !== loginNow) {
      actions.getUserInfo(loginNext);
    }
  }
  componentDidMount() {
    const { actions, match } = this.props;
    actions.getUserInfo(match.params.loginname);
  }
  render() {
    const { info, getInfoStatus } = this.props;
    if (getInfoStatus === 'pending') {
      return (
        <NavBar>
          <div style={{ paddingTop: '10px' }}>
            <Card loading style={{ width: '100%' }}>
              修的麻袋
          </Card>
          </div>
        </NavBar>
      );
    } else if (getInfoStatus === 'succ') {
      const creat_time = moment(info.creat_time).format('YYYY-MM-DD');
      info.recent_topics.forEach(item => item.fromNow = moment(item.last_reply_at).fromNow());
      info.recent_replies.forEach(item => item.fromNow = moment(item.last_reply_at).fromNow());
      return (
        <NavBar>
          <div className="user-info">
            <Card className="info-card" noHovering='false' title="用户信息" style={{ width: '100%' }}>
              <img src={info.avatar_url} alt="avatar" style={{ width: 80, height: 80 }} />
              <div>用户名：<span className="info-value">{info.loginname}</span></div>
              <div>邮箱：<span className="info-value">{info.email}</span></div>
              <div>注册时间：<span className="info-value">{creat_time}</span></div>
              {info.signature && <div>个性签名：<span className="info-value info-signature">{`"${info.signature}"`}</span></div>}
              {info.web && (
                <div>个人网站：<a className="info-value" href={info.web}>{info.web}</a></div>
              )}
            </Card>
            <Card className="info-card info-topic" noHovering='false' title="创建的话题">
              <ul>
                {info.recent_topics.length ?
                  info.recent_topics.map(item => (
                    <li key={item.id} className="user-topic-item">
                      <div className="topic-title"><Link to={`/topics/${item.id}`}>{item.title}</Link></div>
                      <div className="topic-count">{item.visit_count}条浏览 • {item.reply_count}条回复 • 最后回复于{item.fromNow}</div>
                    </li>
                  ))
                  : <li className="user-topic-item">未发表过话题</li>
                }
              </ul>
            </Card>
            <Card className="info-card info-topic" noHovering='false' title="最近回复的话题">
              <ul>
                {info.recent_replies.length ?
                  info.recent_replies.map(item => (
                    <li key={item.id} className="user-topic-item">
                      <div className="topic-title"><Link to={`/topics/${item.id}`}>{item.title}</Link></div>
                      <div className="topic-count">{item.visit_count}条浏览 • {item.reply_count}条回复 • 最后回复于{item.fromNow}</div>
                    </li>
                  ))
                  : <li className="user-topic-item">未回复过话题</li>
                }
              </ul>
            </Card>
          </div>
        </NavBar>
      );
    } else if (getInfoStatus === 'NoData') {
      return (
        <NavBar>
          <div style={{ paddingTop: '10px' }}>
            <Card title="出错" style={{ width: '100%' }}>
              <p>该用户可能已经被删除了~</p>
            </Card>
          </div>
        </NavBar>
      );
    } else {
      return (
        <NavBar>
          <div style={{ paddingTop: '10px' }}>
            <Card title="出错" style={{ width: '100%' }}>
              <p>可能是网络或者服务器出问题了~</p>
            </Card>
          </div>
        </NavBar>
      );
    }
  }
}

UserInfo.propTypes = {
  actions: PropTypes.shape({
    getUserInfo: PropTypes.func,
  }),
  getInfoStatus: PropTypes.oneOf([ '', 'pending', 'succ', 'NoData', 'netErr' ]),
  info: PropTypes.object,
};

function mapStateToProps(state) {
  const props = {
    getInfoStatus: state.user.getInfoStatus,
    info: state.user.info,
  };
  return props;
}

function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo));
