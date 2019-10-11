import React from 'react';

export default props => {
  console.log('Hazard.render');

  return (
    <>
      <h3>Hazard Name</h3>
      <h3>{props.HazardName}</h3>
      {props.children}
    </>
  );
};
