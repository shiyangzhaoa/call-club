import React from 'react';
import { Timeline } from 'antd';

const Steps = (props) => (
  <Timeline>
    {props.steps.map(item => (
      <Timeline.Item key={item.title} color={item.finshed ? 'green' : '#eee'}>
        {item.title}
      </Timeline.Item>
    ))}
  </Timeline>
);

export default Steps;
