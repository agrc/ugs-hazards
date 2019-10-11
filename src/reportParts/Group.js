import React from 'react';
import config from '../config';

export default props => {
  return (
    <div className="page-break">
      <h1 title={config.notProd && 'HazardGroupingsTable.HazardGroup'}>{props.name}</h1>
      <p dangerouslySetInnerHTML={{ __html: props.text}} title={config.notProd && 'HazardGroupTextTable.Text'}></p>
      {props.children}
    </div>
  );
};
