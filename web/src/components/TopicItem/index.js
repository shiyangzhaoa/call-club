import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import './index.scss';

const TopicItem = (props) => {
  const style = {
    color: props.info.top || props.info.good ? '#cc1e4e' : '#fff'
  }
  const { info } = props;
  const lastReply = moment(info.last_reply_at).fromNow()
  return (
  <div className="topic-item">
    <Card title={
      <span style={{...style}}>{info.kind}</span>
    } bordered={true} style={{ width: '100%' }}>
      <div className="topic-info">
        <div className="topic-content">
          {info.author && <Link to={`/user-info/${info.author.loginname}`}><img className="avatar_img" src={info.author.avatar_url} alt="avatar"/></Link>}
          {info.author ? 
          <div className="topic-msg">
            <span className="topic-title"><Link to={`/topics/${info._id}`}>{info.title}</Link></span>
            <div className="topic-count"><Link to={`/user-info/${info.author.loginname}`}>{info.author.loginname}</Link> > 浏览量{info.visit_count} • 最后回复于{lastReply}</div>
          </div>
          : <span className="topic-title">无数据</span>}
        </div>
        {!!info.reply_count && <div className="message">{info.reply_count}</div>}
      </div>
    </Card>
  </div>
  )
}

export default TopicItem;