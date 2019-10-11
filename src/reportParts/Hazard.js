import React from 'react';

export default props => {
  console.log('Hazard.render', props);

  return (
    <>
      <h3>{props.name}</h3>
      {props.children}
    </>
  );
};
