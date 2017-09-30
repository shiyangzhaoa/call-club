import React from 'react';

import './no-match.scss';

class NoMatch extends React.Component {

  render() {
    return (
      <div className="index">
        404!Not Found~
      </div>
    );
  }
}

NoMatch.defaultProps = {
};

export default NoMatch;
