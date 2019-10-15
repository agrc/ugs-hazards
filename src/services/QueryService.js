import config from '../config';
import { stringify } from 'query-string';
import { getHazardCodeFromUnitCode } from '../helpers';


export const queryUnitsAsync = async (meta, aoi) => {
  console.log('QueryService.queryUnitsAsync');

  const [url, hazard] = meta;

  const hazardField = `${hazard}HazardUnit`;

  const parameters = {
    geometryType: 'esriGeometryPolygon',
    geometry: JSON.stringify(aoi),
    returnGeometry: false,
    outFields: hazardField,
    f: 'json'
  };

  const response = await fetch(`${config.urls.baseUrl}/${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return {
    units: responseJson.features.map(feature => feature.attributes[hazardField]),
    hazard,
    url
  };
};

const getDistinctHazardCodesFromUnits = units => {
  return units.map(unit => getHazardCodeFromUnitCode(unit));
}

const queryTable = async (url, where, outFields) => {
  const parameters = {
    where,
    outFields,
    f: 'json'
  };

  const response = await fetch(`${url}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return responseJson.features.map(feature => feature.attributes);
};

export const queryHazardUnitTableAsync = units => {
  console.log('QueryService.queryHazardUnitTableAsync');

  const where = `HazardUnit IN ('${units.join('\',\'')}')`;
  const outFields = 'HazardName,HazardUnit,HowToUse,Description';

  return queryTable(config.urls.hazardUnitTextTable, where, outFields);
};

export const queryReferenceTableAsync = units => {
  console.log('QueryService.queryReferenceTableAsync');

  units = getDistinctHazardCodesFromUnits(units);
  const where = `Hazard IN ('${units.join('\',\'')}')`;
  const outFields = 'Hazard,Text';

  return queryTable(config.urls.hazardReferenceTextTable, where, outFields);
};

export const queryIntroTextAsync = units => {
  console.log('QueryService.queryIntroTextAsync');

  units = getDistinctHazardCodesFromUnits(units);
  const where = `Hazard IN ('${units.join('\',\'')}')`;
  const outFields = 'Hazard,Text';

  return queryTable(config.urls.hazardIntroTextTable, where, outFields);
};

export const queryGroupingAsync = units => {
  console.log('QueryService.queryGroupingAsync');

  units = getDistinctHazardCodesFromUnits(units);
  const where = `HazardCode IN ('${units.join('\',\'')}')`;
  const outFields = 'HazardCode,HazardGroup';

  return queryTable(config.urls.hazardGroupingsTable, where, outFields);
};

export const queryGroupTextAsync = groups => {
  console.log('QueryService.queryGroupTextAsync');

  const where = `HazardGroup IN ('${groups.join('\',\'')}')`;
  const outFields = 'HazardGroup,Text';

  return queryTable(config.urls.hazardGroupTextTable, where, outFields);
};

export const queryReportTextTableAsync = () => {
  console.log('QueryService.queryReportTextTableAsync');

  const where = '1 = 1';
  const outFields = 'Section, Text';

  return queryTable(config.urls.reportTextTable, where, outFields);
};

export const queryOtherDataTable = () => {
  console.log('QueryService.queryOtherDataTable');

  const where = '1 = 1';
  const outFields = 'Data, Introduction, HowToUse, References_';

  return queryTable(config.urls.otherDataTable, where, outFields);
};
