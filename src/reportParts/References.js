import React from 'react';
import config from '../config';

export default props => {
  console.log('References.render');
  return (
    <>
      <h3>References</h3>
      {props.references && props.references.map((reference, index) =>
        <p key={index} dangerouslySetInnerHTML={{ __html: reference }}
          title={config.notProd && 'HazardReferenceTextTable.Text'}></p>)}
    </>
  );
};
