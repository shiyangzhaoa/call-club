import {
  COMMIT_COMMENT_REQUSET,
  COMMIT_COMMENT_SUCCESS,
  COMMIT_COMMENT_FAILED,
  UP_REPLY_REQUEST,
  UP_REPLY_SUCCESS,
  UP_REPLY_FAILD,
} from './../apis';

const initState = {
  commitStatus: '',
  upStatus: '',
  upAction: {},
}

export default function commitComment(state=initState, action) {
  switch(action.type) {
    case COMMIT_COMMENT_REQUSET:
    case COMMIT_COMMENT_SUCCESS:
    case COMMIT_COMMENT_FAILED:
      return Object.assign({}, state, { commitStatus: action.status });
    case UP_REPLY_REQUEST:
    case UP_REPLY_SUCCESS:
    case UP_REPLY_FAILD:
      return Object.assign({}, state, { upStatus: action.status, upAction: action.action });
    default:
      return state;
  }
}