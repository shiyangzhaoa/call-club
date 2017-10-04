import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

import './index.scss';

const Header = (props) => (
  <Breadcrumb className="breadcrumb">
    <Breadcrumb.Item><Link to={props.backTo} style={{color: '#fff'}}>{props.back}</Link></Breadcrumb.Item>
    <Breadcrumb.Item>{props.now}</Breadcrumb.Item>
  </Breadcrumb>
);

export default Header;