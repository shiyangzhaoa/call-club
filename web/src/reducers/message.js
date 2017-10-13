import {
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
} from './../apis';

const initState = {
  messageCountStatus: '',
  count: 0,
  getMessageStatus: '',
  messages: null,
  markOneStatus: '',
  markAllStatus: '',
};

export default function commitComment(state=initState, action) {
  switch(action.type) {
    case GET_MESSAGE_COUNT_REQUEST:
      return Object.assign({}, state, { messageCountStatus: action.status });
    case GET_MESSAGE_COUNT_SUCCESS:
    case GET_MESSAGE_COUNT_FAILED:
      return Object.assign({}, state, { messageCountStatus: action.status, count: action.count });
    case GET_MESSAGES_REQUEST:
    case GET_MESSAGES_SUCCESS:
    case GET_MESSAGES_FAILED:
      return Object.assign({}, state, { getMessageStatus: action.status, messages: action.messages });
    case MARK_ONE_MESSAGE_REQUEST:
    case MARK_ONE_MESSAGE_SUCCESS:
    case MARK_ONE_MESSAGE_FAILED:
      return Object.assign({}, state, { markOneStatus: action.status });
    case  MARK_ALL_MESSAGE_REQUEST:
    case  MARK_ALL_MESSAGE_SUCCESS:
    case  MARK_ALL_MESSAGE_FAILED:
      return Object.assign({}, state, { markAllStatus: action.status, markResult: action.data });
    default:
      return state;
  }
}
