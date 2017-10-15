import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'antd/dist/antd.css';
import 'github-markdown-css';
import 'react-quill/dist/quill.snow.css';
import './style/animation.scss';
import './style/global.scss';
import './server/interceptors';
import AppRouter from './routers';
import configureStore from './stores';

import registerServiceWorker from './registerServiceWorker';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
