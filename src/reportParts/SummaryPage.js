import React from 'react';
import config from '../config';
import './SummaryPage.scss';
import { kebabCase } from 'lodash';


export default props => {
  console.log('SummaryPage.render', props);

  const hazardUnits = Object.keys(props.hazardToUnitMap).reduce((previous, current) => {
    return previous.concat(props.hazardToUnitMap[current]);
  }, []);

  return (
    <div className="page-break summary-page">
      <div className="header">
        <h1>Report Summary</h1>
      </div>
      <p dangerouslySetInnerHTML={{ __html: props.Top }} title={config.notProd && "ReportTextTable.Text(Top)"}></p>
      <p dangerouslySetInnerHTML={{ __html: props['Table1headingautogenerated table'] }}
        title={config.notProd && "ReportTextTable.Text(Table 1 heading...)"}></p>
      <table className="summary-page__table summary-page__table--bordered">
        <thead>
          <tr>
            <th>Mapped Geologic Hazards</th>
            <th>Mapped Hazard Severity</th>
          </tr>
        </thead>
        <tbody>
          { hazardUnits.map((unit, index) =>
            <tr key={index}>
              <td><a className="print--as-text" href={`#${kebabCase(unit.HazardName)}`}>{unit.HazardName}</a></td>
              <td>{unit.UnitName}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p dangerouslySetInnerHTML={{ __html: props['Table2headingautogenerated table'] }}
        title={config.notProd && "ReportTextTable.Text(Table 2 heading...)"}></p>
      <table className="summary-page__table summary-page__table--bordered">
        <thead>
          <tr>
            <th>Other Available Data</th>
          </tr>
        </thead>
        <tbody>
          { props.lidarFeatures.length > 0 &&
            <tr>
              <td>Lidar Elevation Data (high-resolution ground topography)</td>
            </tr>
          }
          { props.aerialFeatures.length > 0 &&
            <tr>
              <td>Aerial Photography and Imagery</td>
            </tr>
          }
          { props.aerialFeatures.length < 1 && props.lidarFeatures.length < 1 &&
            <tr>
              <td>No other data</td>
            </tr>
          }
        </tbody>
      </table>
      <p dangerouslySetInnerHTML={{ __html: props.Bottom }} title={config.notProd && "ReportTextTable.Text(Bottom)"}></p>
    </div>
  );
};
