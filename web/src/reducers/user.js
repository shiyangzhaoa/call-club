import {
  SUBMIT_REGISTER_REQUSET,
  SUBMIT_REGISTER_SUCCESS,
  SUBMIT_REGISTER_FAILED,
  LOGIN_REQUSET,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  GET_USERINFO_REQUSET,
  GET_USERINFO_SUCCESS,
  GET_USERINFO_FAILED,
  UPDATE_SETTING_REQUEST,
  UPDATE_SETTING_SUCCESS,
  UPDATE_SETTING_FAILED,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILED,
} from './../apis';

const initState = {
  registerStatus: '',
  info: null,
  loginStatus: '',
  getInfoStatus: '',
  updateStatus: '',
  changeStatus: '',
}

export default function user (state = initState, action) {
  switch(action.type) {
    case SUBMIT_REGISTER_REQUSET:
    case SUBMIT_REGISTER_SUCCESS:
    case SUBMIT_REGISTER_FAILED:
      return Object.assign({}, state, { registerStatus: action.status });
    case LOGIN_REQUSET:
    case LOGIN_SUCCESS:
    case LOGIN_FAILED:
      return Object.assign({}, state, { loginStatus: action.status });
    case GET_USERINFO_REQUSET:
    case GET_USERINFO_SUCCESS:
    case GET_USERINFO_FAILED:
      return Object.assign({}, state, { info: action.info }, { getInfoStatus: action.status });
    case UPDATE_SETTING_REQUEST:
    case UPDATE_SETTING_SUCCESS:
    case UPDATE_SETTING_FAILED:
      return Object.assign({}, state, { updateStatus: action.status });
    case UPDATE_PASSWORD_REQUEST:
    case UPDATE_PASSWORD_SUCCESS:
    case UPDATE_PASSWORD_FAILED:
      return Object.assign({}, state, { changeStatus: action.status });
    default:
      return state;
  }
}