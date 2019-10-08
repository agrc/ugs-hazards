import React, { useState } from 'react';
import './App.scss';
import { stringify } from 'query-string';
import stringifyObject from 'stringify-object';
import config from './config';


const defaultParameters = {
  geometryType: 'esriGeometryPolygon',
  returnGeometry: false,
  returnCentroid: false,
  spatialRel: 'esriSpatialRelIntersects',
  f: 'json'
};

export default props => {
  console.log('App');

  const [ units, setUnits ] = useState([]);
  const makeRequest = async ([featureService, hazardCode]) => {
    const parameters = {
      geometry: JSON.stringify(props.aoi),
      outFields: "*",
      ...defaultParameters
    };

    const response = await fetch(`${config.urls.baseUrl}/${featureService}/query?${stringify(parameters)}`);
    const responseJson = await response.json();

    return [responseJson.features, hazardCode];
  };

  const getData = async (aoi) => {
    const newUnits = await Promise.all(config.queries.map(makeRequest));

    setUnits(newUnits);
  };

  if (units.length === 0) {
    getData(props.aoi);
  }

  const stringifyParams = { indent: '  ' };

  return (
    <div className="app">
      <h3>Input polygon</h3>
      <p className="code">{stringifyObject(props.aoi, stringifyParams)}</p>
      <h3>Hazards Found</h3>
      <div className="code">
        { units.map(([features, hazardCode]) =>
          <div key={hazardCode}>
            <h4>{hazardCode}</h4>
            <p>{stringifyObject(features, stringifyParams)}</p>
          </div>)
        }
      </div>
    </div>
  );
}
