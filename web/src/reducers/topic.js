import {
  GET_TOPICS_REQUEST,
  GET_TOPICS_SUCCESS,
  GET_TOPICS_FAILED,
  CREAT_TOPIC_REQUSET,
  CREAT_TOPIC_SUCCESS,
  CREAT_TOPIC_FAILED,
  GET_TOPIC_DETAIL_REQUSET,
  INIT_TOPIC_DETAIL,
  GET_TOPIC_DETAIL_SUCCESS,
  GET_TOPIC_DETAIL_FAILED,
  GET_COLLECT_REQUEST,
  GET_COLLECT_SUCCESS,
  GET_COLLECT_FAILED,
  CANCEL_COLLECT_REQUEST,
  CANCEL_COLLECT_SUCCESS,
  CANCEL_COLLECT_FAILD,
  NO_REPLY_TOPIC_REQUEST,
  NO_REPLY_TOPIC_SUCCESS,
  NO_REPLY_TOPIC_FAILED,
  DELETE_TOPIC_REQUEST,
  DELETE_TOPIC_SUCCESS,
  DELETE_TOPIC_FAILED,
  UPDATE_TOPIC_REQUEST,
  UPDATE_TOPIC_SUCCESS,
  UPDATE_TOPIC_FAILED,
} from './../apis';

const initState = {
  topics: null,
  limit: 0,
  getTopicStatus: '',
  createTopicStatus: '',
  getTopicDetailStatus: '',
  topic_detail: null,
  collectStatus: '',
  cancelStatus: '',
  noReplyStatus: '',
  noReplyTopic: [],
  deleteTopicStatus: '',
  updateTopicStatus: '',
}

export default function topic (state = initState, action) {
  switch(action.type) {
    case GET_TOPICS_REQUEST:
    case GET_TOPICS_SUCCESS:
    case GET_TOPICS_FAILED:
      return Object.assign({}, state, { topics: action.topics || {}, getTopicStatus: action.status, limit: action.limit || 0 });
    case CREAT_TOPIC_REQUSET:
    case CREAT_TOPIC_SUCCESS:
    case CREAT_TOPIC_FAILED:
      return Object.assign({}, state, { createTopicStatus: action.status });
    case GET_TOPIC_DETAIL_REQUSET:
    return Object.assign({}, state, { getTopicDetailStatus: action.status });
    case GET_TOPIC_DETAIL_SUCCESS:
    case GET_TOPIC_DETAIL_FAILED:
    case INIT_TOPIC_DETAIL:
      return Object.assign({}, state, { topic_detail: action.topicDetail, getTopicDetailStatus: action.status });
    case GET_COLLECT_REQUEST:
    case GET_COLLECT_SUCCESS:
    case GET_COLLECT_FAILED:
      return Object.assign({}, state, { collectStatus: action.status });
    case CANCEL_COLLECT_REQUEST:
    case CANCEL_COLLECT_SUCCESS:
    case CANCEL_COLLECT_FAILD:
      return Object.assign({}, state, { cancelStatus: action.status });
    case NO_REPLY_TOPIC_REQUEST:
    case NO_REPLY_TOPIC_SUCCESS:
    case NO_REPLY_TOPIC_FAILED:
      return Object.assign({}, state, { noReplyStatus: action.status, noReplyTopic: action.topics || [] });
    case DELETE_TOPIC_REQUEST:
    case DELETE_TOPIC_SUCCESS:
    case DELETE_TOPIC_FAILED:
      return Object.assign({}, state, { deleteTopicStatus: action.status });
    case UPDATE_TOPIC_REQUEST:
    case UPDATE_TOPIC_SUCCESS:
    case UPDATE_TOPIC_FAILED:
      return Object.assign({}, state, { updateTopicStatus: action.status });
    default:
      return state;
  }
}