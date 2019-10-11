import React from 'react';

export default props => {
  return (
    <>
      <h1>{props.name}</h1>
      <p>{props.text}</p>
      {props.children}
    </>
  );
};
