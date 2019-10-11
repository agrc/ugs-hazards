import config from '../config';
import { stringify } from 'query-string';
import { getHazardCodeFromUnitCode } from '../helpers';


const defaultParameters = {
  geometryType: 'esriGeometryPolygon',
  returnGeometry: false,
  returnCentroid: false,
  spatialRel: 'esriSpatialRelIntersects',
  f: 'json'
};

export const queryUnitsAsync = async (meta, aoi) => {
  console.log('QueryService.queryUnitsAsync');

  const [url, hazard] = meta;

  const hazardField = `${hazard}HazardUnit`;

  const parameters = {
    geometry: JSON.stringify(aoi),
    outFields: hazardField,
    ...defaultParameters
  };

  const response = await fetch(`${config.urls.baseUrl}/${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return {
    units: responseJson.features.map(feature => feature.attributes[hazardField]),
    hazard,
    url
  };
};

export const queryHazardUnitTableAsync = async (units) => {
  console.log('QueryService.queryHazardUnitTableAsync');

  const url = config.urls.hazardUnitTextTable;

  const whereClause = `${config.fieldNames.HazardUnit} IN ('${units.join('\',\'')}')`;

  const parameters = {
    where: whereClause,
    outFields: 'HazardName,HazardUnit,HowToUse,Description',
    returnGeometry: false,
    returnCentroid: false,
    f: 'json'
  };

  const response = await fetch(`${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return responseJson.features.map(feature => feature.attributes);
};

export const queryReferenceTableAsync = async (units) => {
  console.log('QueryService.queryReferenceTableAsync');

  const url = config.urls.hazardReferenceTextTable;

  units = new Set(units.map(unit => getHazardCodeFromUnitCode(unit)));

  const whereClause = `${config.fieldNames.Hazard} IN ('${Array.from(units).join('\',\'')}')`;

  const parameters = {
    where: whereClause,
    outFields: 'Hazard,Text',
    returnGeometry: false,
    returnCentroid: false,
    f: 'json'
  };

  const response = await fetch(`${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return responseJson.features.map(feature => feature.attributes);
};

export const queryIntroTextAsync = async (units) => {
  console.log('QueryService.queryIntroTextAsync');

  const url = config.urls.hazardIntroTextTable;

  units = new Set(units.map(unit => getHazardCodeFromUnitCode(unit)));

  const whereClause = `${config.fieldNames.Hazard} IN ('${Array.from(units).join('\',\'')}')`;

  const parameters = {
    where: whereClause,
    outFields: 'Hazard,Text',
    returnGeometry: false,
    returnCentroid: false,
    f: 'json'
  };

  const response = await fetch(`${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return responseJson.features.map(feature => feature.attributes);
};

export const queryGroupingAsync = async (units) => {
  console.log('QueryService.queryGroupingAsync');

  const url = config.urls.hazardGroupingsTable;

  units = new Set(units.map(unit => getHazardCodeFromUnitCode(unit)));

  const whereClause = `${config.fieldNames.HazardCode} IN ('${Array.from(units).join('\',\'')}')`;

  const parameters = {
    where: whereClause,
    outFields: 'HazardCode,HazardGroup',
    returnGeometry: false,
    returnCentroid: false,
    f: 'json'
  };

  const response = await fetch(`${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return responseJson.features.map(feature => feature.attributes);
};

export const queryGroupTextAsync = async (groups) => {
  console.log('QueryService.queryGroupTextAsync');

  const url = config.urls.hazardGroupTextTable;

  const whereClause = `HazardGroup IN ('${Array.from(new Set(groups)).join('\',\'')}')`;

  const parameters = {
    where: whereClause,
    outFields: 'HazardGroup,Text',
    returnGeometry: false,
    returnCentroid: false,
    f: 'json'
  };

  const response = await fetch(`${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return responseJson.features.map(feature => feature.attributes);
};
