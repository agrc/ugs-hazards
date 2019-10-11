import React from 'react';

export default props => {
  return (
    <>
      <h1>{props.name}</h1>
      <p dangerouslySetInnerHTML={{ __html: props.text}}></p>
      {props.children}
    </>
  );
};
