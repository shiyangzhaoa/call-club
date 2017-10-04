import React from 'react';

import './index.scss';
import NotFound from './../../sources/404.jpg';
import Crow from './../../sources/crow.jpg';
import Point from './../../sources/dian.svg';

class NoMatch extends React.Component {

  render() {
    return (
      <div className="not-found">
        <div className="fly-box" style={{backgroundImage: `url(${Point})`}}></div>
        <div className="crow-box">
          <img src={Crow} alt="Crow"/>
        </div>
        <div>
          <div className="number">404</div>
          <span className="warin-text">page not found</span>
        </div>
        <img src={NotFound} alt="Not Found"/>
      </div>
    );
  }
}

NoMatch.defaultProps = {
};

export default NoMatch;
