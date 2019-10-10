import React from 'react';
import config from './config';
import './Unit.scss';


export default props => {
  return (
    <div className="unit">
    <span style={{border: '1px solid black'}}>symbol</span>
    <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.Description]}}></p>
      <h3>How to Use This Map</h3>
      <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.HowToUse]}}></p>
    </div>
  );
};
