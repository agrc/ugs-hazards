import React from 'react';
import config from '../config';


export default props => {
  console.log('SummaryPage.render', props);

  let table1Heading = 'Table 1';
  let table2Heading = 'Table 2';
  Object.keys(props).forEach(key => {
    if (key.match(table1Heading)) {
      table1Heading = props[key];
    } else if (key.match(table2Heading)) {
      table2Heading = props[key];
    }
  });

  return (
    <div className="page-break">
      <div className="header">
        <h1>Report Summary</h1>
      </div>
      <p dangerouslySetInnerHTML={{ __html: props.Top }} title={config.notProd && "ReportTextTable.Text(Top)"}></p>
      <p dangerouslySetInnerHTML={{ __html: table1Heading }}
        title={config.notProd && "ReportTextTable.Text(Table 1 heading...)"}></p>
      {'<table>'}
      <p dangerouslySetInnerHTML={{ __html: table2Heading }}
        title={config.notProd && "ReportTextTable.Text(Table 2 heading...)"}></p>
      {'<table>'}
      <p dangerouslySetInnerHTML={{ __html: props.Bottom }} title={config.notProd && "ReportTextTable.Text(Bottom)"}></p>
    </div>
  );
};
