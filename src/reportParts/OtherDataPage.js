import React from 'react';
import config from '../config';


export default props => {
  return (
    <div className="page-break">
      <div className="header">
        <h1>OTHER DATA</h1>
        <h2>{props.Data}</h2>
      </div>
      <p dangerouslySetInnerHTML={{ __html: props.Introduction }}
        title={config.notProd && "OtherDataTable.Introduction"}></p>
      <div>{"<map>"}</div>
      {props.children}
      <h4>How To Use This Map</h4>
      <p dangerouslySetInnerHTML={{ __html: props.HowToUse }}
        title={config.notProd && "OtherDataTable.HowToUse"}></p>
      { props.References_ &&
        <>
          <h4>References</h4>
          <p dangerouslySetInnerHTML={{ __html: props.References_ }}
            title={config.notProd && "OtherDataTable.References_"}></p>
        </>
      }
    </div>
  );
};
