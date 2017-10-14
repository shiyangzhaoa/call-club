import { AUTH_REQUSET, AUTH_SUCCESS, AUTH_FAILED, INIT_USER_INFO } from './../apis';

const initState = {
  status: '',
  auth: {}
}

export default function user (state = initState, action) {
  switch (action.type) {
    case AUTH_REQUSET:
    case AUTH_SUCCESS:
    case AUTH_FAILED:
      return Object.assign({}, state, { status: action.status }, { auth: action.auth || {} });
    case INIT_USER_INFO:
      return Object.assign({}, state, { auth: {} });
    default:
      return state;
  }
}