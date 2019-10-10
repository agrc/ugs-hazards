import React, { useState } from 'react';
import './App.scss';
import { stringify } from 'query-string';
import config from './config';
import Hazard from './Hazard';
import AoiContext from './AoiContext';


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
      outFields: '*',
      ...defaultParameters
    };

    const response = await fetch(`${config.urls.baseUrl}/${featureService}/query?${stringify(parameters)}`);
    const responseJson = await response.json();

    return {
      features: responseJson.features.map(feature => feature.attributes),
      hazardCode,
      url: featureService
    };
  };

  const getData = async () => {
    const newHazards = await Promise.all(config.queries.map(makeRequest));

    setHazards(newHazards.filter(({features}) => features.length > 0));
  };

  if (hazards.length === 0) {
    getData();
  }

  return (
    <div className="app">
      <AoiContext.Provider value={props.aoi}>
        <h1>Input polygon</h1>
        <p className="code">{JSON.stringify(props.aoi, null, 1)}</p>
        <h1>Hazards Found</h1>
        { hazards.map((hazard, index) => <Hazard key={index} {...hazard} />) }
      </AoiContext.Provider>
    </div>
  );
}
