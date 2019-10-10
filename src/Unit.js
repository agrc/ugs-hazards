import React from 'react';
import config from './config';
import './Unit.scss';


export default props => {
  return (
    <div className="unit">
      <p>{props[config.fieldNames.Description]}</p>
      <h3>Explanation of Map Units</h3>
      ?? - some sort of legend symbol??
      <h3>How to Use This Map</h3>
      <p>{props[config.fieldNames.HowToUse]}</p>
    </div>
  );
};
