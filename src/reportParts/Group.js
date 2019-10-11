import React from 'react';
import config from '../config';

export default props => {
  return (
    <>
      <h1 title={config.notProd && 'HazardGroupingsTable.HazardGroup'}>{props.name}</h1>
      <p dangerouslySetInnerHTML={{ __html: props.text}} title={config.notProd && 'HazardGroupTextTable.Text'}></p>
      {props.children}
    </>
  );
};
