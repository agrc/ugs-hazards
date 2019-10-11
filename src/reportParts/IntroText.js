import React from 'react';

export default props => {
  console.log('IntroText.render');

  return (
    <>
      <h3>Intro Text</h3>
      <p dangerouslySetInnerHTML={{ __html: props.text }}></p>
    </>
  );
};
