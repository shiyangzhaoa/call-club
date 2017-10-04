import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { withRouter } from 'react-router';

import Home from './../containers/Home';
import Login from './../containers/Login';
import TopicDetail from './../containers/TopicDetail';
import UserInfo from './../containers/UserInfo';
import NoMatch from './../components/NoMatch';
import Register from './../containers/Register';
import CreateTopic from './../containers/CreateTopic';
import Message from './../containers/Message';
import Setting from './../containers/Settings';

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/page/:pageNum?" exact component={Home}/>
        <Route path="/category/:categorySlug/:pageNum?" exact component={Home}/>
        <Route path="/topics/:id" component={TopicDetail}/>
        <Route path="/user-info/:loginname" component={UserInfo}/>
        <AuthRoute path='/message' component={Message}/>
        <PrivateRoute path="/login" component={Login}/>
        <PrivateRoute path="/register" component={Register}/>
        <AuthRoute path='/create-topic' component={CreateTopic}/>
        <AuthRoute path='/edit-topic/:topicId' component={CreateTopic}/>
        <AuthRoute path='/setting' component={Setting}></AuthRoute>
        <Route component={NoMatch}/>
      </Switch>
    </div>
  </Router>
);

const Private = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    localStorage.getItem('login_token') ? (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props}/>
    )
  )}/>
)

const AuthRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !localStorage.getItem('login_token') ? (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props}/>
    )
  )}/>
)

const PrivateRoute = withRouter(Private);


export default AppRouter;
