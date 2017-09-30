
import { combineReducers } from 'redux';

import topic from './topic';
import user from './user';
import auth from './auth';
import comment from './comment';
import message from './message';

const combined = combineReducers({ topic, user, auth, comment, message });
export default combined;
