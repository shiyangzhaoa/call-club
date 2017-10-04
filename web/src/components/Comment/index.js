import React from 'react'
import { Icon } from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ReactMarkdown from 'react-markdown';

import './index.scss';

const Comment = props => {
  const style = {
    fontSize: props.is_up ? '18px' : '14px',
    color: props.is_up ? '#000' : '#c8c8c8',
    transition: 'all .5s',
  }
  const { info, index, changeStatus, upReply, commentId, author, deleteReply } = props;
  const dura = moment(info.create_at).fromNow();
  return (
    <div className="comment-item">
      <Link to={`/user-info/${info.author.loginname}`}>
        <img className="reply-avatar" src={info.author.avatar_url} alt="reply_obj"/>
      </Link>
      <div className="reply-body">
        <div className="reply-head">
          <div>
            <Link to={`/user-info/${info.author.loginname}`} className="reply-name">{info.author.loginname}</Link>
            <span style={{fontSize: '11px'}}>{`${index + 1}楼•${dura}`}</span>
          </div>
          <div>
            {
              info.author_id === author &&
              <a style={{marginRight: '8px', color: '#666'}} onClick={() => deleteReply(info.id)}>
                <Icon type="delete" />
              </a>
            }
            <a>
              <Icon type="like" onClick={() => upReply(info.id, index)} style={{...style}}/>
            </a>
            <span style={{marginRight: '8px'}}>{props.ups.length}</span>
            <a onClick={changeStatus} style={{color: '#666'}}>
              <Icon type="export" />
            </a>
          </div>
        </div>
        <ReactMarkdown className="markdown-body" source={info.content} />
        {commentId === info.id && props.children}
      </div>
    </div>
  );
}

export default Comment;