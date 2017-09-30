import axios from 'axios';

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('login_token');
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});