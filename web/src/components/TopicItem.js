import React from 'react';
import { Card } from 'antd';
import { Link } from 'react-router-dom';

import './topic-item.scss';

const TopicItem = (props) => {
  const style = {
    color: props.info.top || props.info.good ? '#108ee9' : '#999'
  }
  return (
  <div className="topic-item">
    <Card title={
      <span style={{...style}}>{props.info.kind}</span>
    } bordered={true} style={{ width: '100%' }}>
      <div className="topic-content">
        {props.info.author && <Link to={`/user-info/${props.info.author.loginname}`}><img className="avatar_img" src={props.info.author.avatar_url} alt="avatar"/></Link>}
        {props.info.author ? 
        <span className="topic-title"><Link to={`/topics/${props.info._id}`}>{props.info.title}</Link></span>
        : <span className="topic-title">无数据</span>}
      </div>
    </Card>
  </div>
  )
}

export default TopicItem;