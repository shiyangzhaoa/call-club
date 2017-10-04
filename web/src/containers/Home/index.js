import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import NavBar from './../../components/NavBar';
import CategoryList from './../CategoryList';

const Home = (pros) => {
  return (
    <NavBar>
      <Switch>
        <Route path="/" exact component={CategoryList} />
        <Route path="/page/:pageNum?" exact component={CategoryList} />
        <Route path="/category/:categorySlug/:pageNum?" exact component={CategoryList} />
      </Switch>
    </NavBar>
  );
}

export default Home;