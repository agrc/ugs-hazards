import React, { useState } from 'react';
import './App.scss';
import { stringify } from 'query-string';


const baseUrl = 'https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services';
const queries = [
  ['Utah_Geologic_Hazards/FeatureServer/1', 'FLHHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/2', 'SGSHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/3', 'LSSHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/5', 'LSUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/6', 'CASHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/7', 'CSSHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/8', 'CRSHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/9', 'EFHHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/10', 'ERZHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/11', 'EXSHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/12', 'GSPHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/13', 'MKFHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/14', 'PESHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/15', 'GRSHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/16', 'RFHHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/17', 'SDHHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/18', 'SBPHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/19', 'SLSHazardUnit'],
  ['Utah_Geologic_Hazards/FeatureServer/20', 'WSSHazardUnit'],
  ['Utah_Earthquake_Hazards/FeatureServer/3', 'LQSHazardUnit'],
  ['Utah_Earthquake_Hazards/FeatureServer/4', 'SFRHazardUnit'],
];
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
  const makeRequest = async ([featureService, field]) => {
    const parameters = {
      geometry: JSON.stringify(props.aoi),
      outFields: field,
      ...defaultParameters
    };

    const response = await fetch(`${baseUrl}/${featureService}/query?${stringify(parameters)}`);
    const responseJson = await response.json();

    return (responseJson.features.length > 0) ? responseJson.features[0].attributes[field] : null;
  };

  const removeNulls = (previous, current) => {
    if (current) {
      previous.push(current);
    }

    return previous;
  };

  const getData = async (aoi) => {
    const newUnits = await Promise.all(queries.map(makeRequest));

    setUnits(newUnits.reduce(removeNulls, []));
  };

  if (units.length === 0) {
    getData(props.aoi);
  }

  return (
    <div className="app">
      <h3>Input polygon</h3>
      <p className="code">{JSON.stringify(props.aoi)}</p>
      <h3>Hazards Found</h3>
      <ul className="code">
        { units.map((data, index) => <li key={index}>{data}</li>) }
      </ul>
    </div>
  );
}
