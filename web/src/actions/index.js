import axios from 'axios';

import {
  GET_TOPICS_REQUEST,
  GET_TOPICS_SUCCESS,
  GET_TOPICS_FAILED,
  SUBMIT_REGISTER_REQUSET,
  SUBMIT_REGISTER_SUCCESS,
  SUBMIT_REGISTER_FAILED,
  LOGIN_REQUSET,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  GET_USERINFO_REQUSET,
  GET_USERINFO_SUCCESS,
  GET_USERINFO_FAILED,
  AUTH_REQUSET,
  AUTH_SUCCESS,
  AUTH_FAILED,
  CREAT_TOPIC_REQUSET,
  CREAT_TOPIC_SUCCESS,
  CREAT_TOPIC_FAILED,
  GET_TOPIC_DETAIL_REQUSET,
  GET_TOPIC_DETAIL_SUCCESS,
  GET_TOPIC_DETAIL_FAILED,
  COMMIT_COMMENT_REQUSET,
  COMMIT_COMMENT_SUCCESS,
  COMMIT_COMMENT_FAILED,
  GET_COLLECT_REQUEST,
  GET_COLLECT_SUCCESS,
  GET_COLLECT_FAILED,
  CANCEL_COLLECT_REQUEST,
  CANCEL_COLLECT_SUCCESS,
  CANCEL_COLLECT_FAILD,
  UP_REPLY_REQUEST,
  UP_REPLY_SUCCESS,
  UP_REPLY_FAILD,
  NO_REPLY_TOPIC_REQUEST,
  NO_REPLY_TOPIC_SUCCESS,
  NO_REPLY_TOPIC_FAILED,
  GET_MESSAGE_COUNT_REQUEST,
  GET_MESSAGE_COUNT_SUCCESS,
  GET_MESSAGE_COUNT_FAILED,
  GET_MESSAGES_REQUEST,
  GET_MESSAGES_SUCCESS,
  GET_MESSAGES_FAILED,
  MARK_ONE_MESSAGE_REQUEST,
  MARK_ONE_MESSAGE_SUCCESS,
  MARK_ONE_MESSAGE_FAILED,
  MARK_ALL_MESSAGE_REQUEST,
  MARK_ALL_MESSAGE_SUCCESS,
  MARK_ALL_MESSAGE_FAILED,
  DELETE_REPLY_REQUEST,
  DELETE_REPLY_SUCCESS,
  DELETE_REPLY_FAILED,
  UPDATE_SETTING_REQUEST,
  UPDATE_SETTING_SUCCESS,
  UPDATE_SETTING_FAILED,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILED,
  DELETE_TOPIC_REQUEST,
  DELETE_TOPIC_SUCCESS,
  DELETE_TOPIC_FAILED,
  UPDATE_TOPIC_REQUEST,
  UPDATE_TOPIC_SUCCESS,
  UPDATE_TOPIC_FAILED,
  INIT_TOPIC_DETAIL,
} from './../apis';

const url = '/api';

//获取主题列表
let defaultQuery = {
  page: 1,
  limit: 10,
  tab: 'all'
}
export const getTopics = (query = defaultQuery) => (dispatch) => {
  dispatch({
    type: GET_TOPICS_REQUEST,
    status: 'pending',
  });
  const postQuery = { ...defaultQuery,
    ...query
  }
  axios.get(`${url}/topics`, {
    params: postQuery,
  }).then(({
    data
  }) => {
    dispatch({
      type: GET_TOPICS_SUCCESS,
      topics: data,
      status: 'succ',
      limit: postQuery.limit,
    });
  }).catch(err => {
    dispatch({
      type: GET_TOPICS_FAILED,
      status: 'failed',
    });
  });
}

//注册用户
export const register = (query) => (dispatch) => {
  dispatch({
    type: SUBMIT_REGISTER_REQUSET,
    status: 'pending',
  });
  axios.post(`${url}/user/register`, query).then(({
    data
  }) => {
    dispatch({
      type: SUBMIT_REGISTER_SUCCESS,
      status: 'succ',
    });
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: SUBMIT_REGISTER_FAILED,
        status: 'userErr',
      });
    } else {
      dispatch({
        type: SUBMIT_REGISTER_FAILED,
        status: 'netErr',
      });
    }
  });
}

//用户登陆
export const login = (query) => (dispatch) => {
  dispatch({
    type: LOGIN_REQUSET,
    status: 'pending',
  });
  axios.post(`${url}/user/login`, query).then(({
    data
  }) => {
    localStorage.setItem('login_token', data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      status: 'succ',
    });
  }).catch(err => {
    if (err.response) {
      const { errCode } = err.response.data
      if (errCode === 103) {
        dispatch({
          type: LOGIN_FAILED,
          status: 'userErr',
        });
      } else if (errCode === 102) {
        dispatch({
          type: LOGIN_FAILED,
          status: 'passErr',
        });
      }
    } else {
      dispatch({
        type: LOGIN_FAILED,
        status: 'netErr',
      });
    }
  });
}

//获取用户信息
export const getUserInfo = (loginname) => (dispatch) => {
  dispatch({
    type: GET_USERINFO_REQUSET,
    status: 'pending',
  })
  axios.get(`${url}/user-info/${loginname}`).then(({
    data
  }) => {
    if (data.loginname) {
      dispatch({
        type: GET_USERINFO_SUCCESS,
        info: data,
        status: 'succ',
      })
    } else {
      dispatch({
        type: GET_USERINFO_SUCCESS,
        status: 'NoData',
      })
    }
  }).catch(e => {
    dispatch({
      type: GET_USERINFO_FAILED,
      status: 'netErr',
    });
  })
}

//如果有token就去获取用户信息
export const auth = () => (dispatch) => {
  const token = localStorage.getItem('login_token');
  if (token) {
    dispatch({
      type: AUTH_REQUSET,
      status: 'pending',
    })
    axios.get(`${url}/user/auth`).then(({
      data
    }) => {
      if (data.loginname) {
        dispatch({
          type: AUTH_SUCCESS,
          status: 'succ',
          auth: data,
        })
      } else {
        dispatch({
          type: AUTH_SUCCESS,
          status: 'timeOut',
        })
      }
    }).catch(err => {
      dispatch({
        type: AUTH_FAILED,
        status: 'netErr',
      });
    });
  }
}

//创建主题
export const createTopic = (query) => (dispatch) => {
  dispatch({
    type: CREAT_TOPIC_REQUSET,
    status: 'pending',
  });
  axios.post(`${url}/topic/create`, query).then(({
    data
  }) => {
    dispatch({
      type: CREAT_TOPIC_SUCCESS,
      status: 'succ',
    });
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: CREAT_TOPIC_FAILED,
        status: 'timeOut',
      });
    } else {
      dispatch({
        type: CREAT_TOPIC_FAILED,
        status: 'netErr',
      });
    }
  });
}

//获取主题详情
export const getTopicDetail = (id) => (dispatch) => {
  dispatch({
    type: GET_TOPIC_DETAIL_REQUSET,
    status: 'pending',
  })
  axios.get(`${url}/topics/${id}`).then(({
    data,
  }) => {
    if (!data.success) {
      dispatch({
        type: GET_TOPIC_DETAIL_SUCCESS,
        status: 'cantFind',
      })
    } else {
      dispatch({
        type: GET_TOPIC_DETAIL_SUCCESS,
        topicDetail: data.topic,
        status: 'succ',
      })
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: GET_TOPIC_DETAIL_FAILED,
        status: 'timeOut',
      });
    } else {
      dispatch({
        type: GET_TOPIC_DETAIL_FAILED,
        status: 'netErr',
      });
    }
  });
}

//不同的文章详情初始化数据
export const initTopic = () => (dispatch) => {
  dispatch({
    type: INIT_TOPIC_DETAIL,
    topicDetail: null,
    status: 'init',
  })
}

//评价
export const commitComment = (topic_id, content, reply_id) => (dispatch) => {
  dispatch({
    type: COMMIT_COMMENT_REQUSET,
    status: 'pending',
  })
  axios.post(`${url}/topic/${topic_id}/replies`, {
    content,
    reply_id,
  }).then(({
    data
  }) => {
    dispatch({
      type: COMMIT_COMMENT_SUCCESS,
      status: 'succ',
    })
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: COMMIT_COMMENT_FAILED,
        status: 'notExist',
      });
    } else {
      dispatch({
        type: COMMIT_COMMENT_FAILED,
        status: 'netErr',
      });
    }
  });
}

//用户收藏主题
export const collect = (topic_id) => (dispatch) => {
  dispatch({
    type: GET_COLLECT_REQUEST,
    status: 'pending',
  })
  axios.post(`${url}/topic/topic_collect/collect`, topic_id).then(({ data }) => {
    if (data) {
      dispatch({
        type: GET_COLLECT_SUCCESS,
        status: 'succ',
      })
    } else {
      throw new Error('错误');
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: GET_COLLECT_FAILED,
        status: 'collected',
      })
    } else {
      dispatch({
        type: GET_COLLECT_FAILED,
        status: 'netErr',
      })
    }
  })
}

//用户取消收藏
export const cancelCollect = (topic_id) => (dispatch) => {
  dispatch({
    type: CANCEL_COLLECT_REQUEST,
    status: 'pending',
  })
  axios.post(`${url}/topic_collect/de_collect`, topic_id).then(({ data }) => {
    if (data) {
      dispatch({
        type: CANCEL_COLLECT_SUCCESS,
        status: 'succ',
      })
    } else {
      throw new Error('错误');
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: CANCEL_COLLECT_FAILD,
        status: 'notCollect',
      })
    } else {
      dispatch({
        type: CANCEL_COLLECT_FAILD,
        status: 'netErr',
      })
    }
  })
}

//用户点赞或者取消点赞
export const upReply = (reply_id) => (dispatch) => {
  dispatch({
    type: UP_REPLY_REQUEST,
    status: 'pending',
  })
  axios.post(`${url}/reply/${reply_id}/ups`).then(({ data }) => {
    if (data) {
      dispatch({
        type: UP_REPLY_SUCCESS,
        status: 'succ',
        action: data,
      })
    } else {
      throw new Error('错误');
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: UP_REPLY_FAILD,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: UP_REPLY_FAILD,
        status: 'netErr',
      })
    }
  })
}

//删除自己的评论
export const delReply = (reply_id) => (dispatch) => {
  dispatch({
    type: DELETE_REPLY_REQUEST,
    status: 'pending',
  })
  axios.delete(`${url}/reply/${reply_id}/delete`).then(({ data }) => {
    if (data) {
      dispatch({
        type: DELETE_REPLY_SUCCESS,
        status: 'succ',
      })
    } else {
      throw new Error('错误');
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: DELETE_REPLY_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: DELETE_REPLY_FAILED,
        status: 'netErr',
      })
    }
  })
}

//获取无人回复的话题
export const noReply = (topic_id) => (dispatch) => {
  dispatch({
    type: NO_REPLY_TOPIC_REQUEST,
    status: 'pending',
  })
  axios.get(`${url}/topic/no_reply`, {
    params: {topic_id},
  }).then(({
    data
  }) => {
    dispatch({
      type: NO_REPLY_TOPIC_SUCCESS,
      status: 'succ',
      topics: data,
    });
  }).catch(e => {
    dispatch({
      type: NO_REPLY_TOPIC_FAILED,
      status: 'netErr',
    });
  })
}

//获取未读消息数量
export const getMessageCount = () => (dispatch) => {
  dispatch({
    type: GET_MESSAGE_COUNT_REQUEST,
    status: 'pending',
  })
  axios.get(`${url}/message/count`).then(({ data }) => {
    dispatch({
      type: GET_MESSAGE_COUNT_SUCCESS,
      status: 'succ',
      count: data.count,
    })
  }).catch(e => {
    if (e.response) {
      dispatch({
        type: GET_MESSAGE_COUNT_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: GET_MESSAGE_COUNT_FAILED,
        status: 'netErr',
      })
    }
  });
}

//获取消息列表
export const getMessages = () => (dispatch) => {
  dispatch({
    type: GET_MESSAGES_REQUEST,
    status: 'pending',
  })
  axios.get(`${url}/messages`).then(({ data }) => {
    dispatch({
      type: GET_MESSAGES_SUCCESS,
      status: 'succ',
      messages: data,
    })
  }).catch(e => {
    if (e.response) {
      dispatch({
        type: GET_MESSAGES_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: GET_MESSAGES_FAILED,
        status: 'netErr',
      })
    }
  });
}

//标记一条信息为已读
export const markOne = (msg_id) => (dispatch) => {
  dispatch({
    type: MARK_ONE_MESSAGE_REQUEST,
    status: 'pending',
  })
  axios.post(`${url}/message/mark_one/${msg_id}`).then(({ data }) => {
    dispatch({
      type: MARK_ONE_MESSAGE_SUCCESS,
      status: 'succ',
    })
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: MARK_ONE_MESSAGE_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: MARK_ONE_MESSAGE_FAILED,
        status: 'netErr',
      })
    }
  })
}

//标记全部信息为已读
export const markAll = () => (dispatch) => {
  dispatch({
    type: MARK_ALL_MESSAGE_REQUEST,
    status: 'pending',
  })
  axios.post(`${url}/message/mark_all`).then(({ data }) => {
    dispatch({
      type: MARK_ALL_MESSAGE_SUCCESS,
      status: 'succ',
      data,
    })
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: MARK_ALL_MESSAGE_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: MARK_ALL_MESSAGE_FAILED,
        status: 'netErr',
      })
    }
  })
}

//更新基本信息
export const updateSetting = (body) => (dispatch) => {
  dispatch({
    type: UPDATE_SETTING_REQUEST,
    status: 'pending',
  })
  axios.put(`${url}/user/basic_setting`, body).then(({ data }) => {
    dispatch({
      type: UPDATE_SETTING_SUCCESS,
      status: 'succ',
    })
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: UPDATE_SETTING_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: UPDATE_SETTING_FAILED,
        status: 'netErr',
      })
    }
  })
}

//更换密码
export const changePass = (body) => (dispatch) => {
  dispatch({
    type: UPDATE_PASSWORD_REQUEST,
    status: 'pending',
  })
  axios.put(`${url}/user/set_password`, body).then(({ data }) => {
    if (data.success) {
      dispatch({
        type: UPDATE_PASSWORD_SUCCESS,
        status: 'succ',
      })
    } else {
      dispatch({
        type: UPDATE_PASSWORD_SUCCESS,
        status: 'errPass',
      })
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: UPDATE_PASSWORD_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: UPDATE_PASSWORD_FAILED,
        status: 'netErr',
      })
    }
  })
}

//删除话题
export const deleteTopic = (topic_id) => (dispatch) => {
  dispatch({
    type: DELETE_TOPIC_REQUEST,
    status: 'pending',
  })
  axios.delete(`${url}/topic/${topic_id}/delete`).then(({ data }) => {
    if (data.success) {
      dispatch({
        type: DELETE_TOPIC_SUCCESS,
        status: 'succ',
      })
    } else {
      dispatch({
        type: DELETE_TOPIC_FAILED,
        status: 'cantFind',
      })
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: DELETE_TOPIC_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: DELETE_TOPIC_FAILED,
        status: 'netErr',
      })
    }
  })
}

//修改话题
export const updateTopic = (body) => (dispatch) => {
  dispatch({
    type: UPDATE_TOPIC_REQUEST,
    status: 'pending',
  })
  axios.put(`${url}/topic/update`, body).then(({ data }) => {
    if (data.success) {
      dispatch({
        type: UPDATE_TOPIC_SUCCESS,
        status: 'succ',
      })
    } else {
      dispatch({
        type: UPDATE_TOPIC_FAILED,
        status: 'cantFind',
      })
    }
  }).catch(err => {
    if (err.response) {
      dispatch({
        type: UPDATE_TOPIC_FAILED,
        status: 'timeOut',
      })
    } else {
      dispatch({
        type: UPDATE_TOPIC_FAILED,
        status: 'netErr',
      })
    }
  })
}