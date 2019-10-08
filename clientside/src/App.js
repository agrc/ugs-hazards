import React, { useState } from 'react';
import './App.scss';
import { stringify } from 'query-string';
import stringifyObject from 'stringify-object';
import config from './config';
import Hazard from './Hazard';


const defaultParameters = {
  geometryType: 'esriGeometryPolygon',
  returnGeometry: false,
  returnCentroid: false,
  spatialRel: 'esriSpatialRelIntersects',
  f: 'json'
};

export default props => {
  console.log('App');

  const [ hazards, setHazards ] = useState([]);
  const makeRequest = async ([featureService, hazardCode]) => {
    const parameters = {
      geometry: JSON.stringify(props.aoi),
      outFields: "*",
      ...defaultParameters
    };

    const response = await fetch(`${config.urls.baseUrl}/${featureService}/query?${stringify(parameters)}`);
    const responseJson = await response.json();

    return [responseJson.features.map(feature => feature.attributes), hazardCode];
  };

  const getData = async (aoi) => {
    const newHazards = await Promise.all(config.queries.map(makeRequest));

    setHazards(newHazards.filter(([features]) => features.length > 0));
  };

  if (hazards.length === 0) {
    getData(props.aoi);
  }

  const stringifyParams = { indent: '  ' };

  return (
    <div className="app">
      <h1>Input polygon</h1>
      <p className="code">{stringifyObject(props.aoi, stringifyParams)}</p>
      <h1>Hazards Found</h1>
      { hazards.map(([units, code]) => <Hazard key={code} units={units} code={code} />) }
    </div>
  );
}
