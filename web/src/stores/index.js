import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

function reduxStore(initialState) {
  const store = createStore(reducers, initialState, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));
  return store;
}

export default reduxStore;
