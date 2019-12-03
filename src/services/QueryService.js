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

  const where = '1=1';
  const outFields = 'Section,Text';

  return queryTable(config.urls.reportTextTable, where, outFields);
};

export const queryOtherDataTableAsync = () => {
  console.log('QueryService.queryOtherDataTable');

  const where = '1=1';
  const outFields = 'Data,Introduction,HowToUse,References_';

  return queryTable(config.urls.otherDataTable, where, outFields);
};

export const queryLidarAsync = async aoi => {
  const parameters = {
    geometryType: 'esriGeometryPolygon',
    geometry: JSON.stringify(aoi),
    returnGeometry: false,
    outFields: ['ProjectName', 'AreaName', 'DataAccessURL'],
    f: 'json'
  };

  const response = await fetch(`${config.urls.lidarExtents}/query?${stringify(parameters)}`);
  const responseJson = await response.json();

  return responseJson.features.map(feature => feature.attributes);
};

export const queryAerialAsync = async aoi => {
  const parameters = {
    geometryType: 'esriGeometryPolygon',
    geometry: JSON.stringify(aoi),
    returnGeometry: false,
    outFields: ['Agency', 'ProjectYear', 'ProjectCode', 'ProjectName', 'Roll', 'Frame'],
    f: 'json',
    orderByFields: 'Agency ASC, ProjectYear DESC, ProjectCode ASC'
  };

  const response = await fetch(`${config.urls.aerialImageryCenterpoints}/query?${stringify(parameters)}`);
  const responseJson = await response.json();
  const features =  responseJson.features.map(feature => feature.attributes);

  // mix in agency descriptions from related table
  const agenciesWhere = `Agency IN ('${features.map(feature => feature.Agency).join(',')}')`;
  const tableResults = await queryTable(config.urls.imageAgenciesTable, agenciesWhere, ['Agency', 'Description']);
  const descriptionsLookup = {};
  tableResults.forEach(result => {
    descriptionsLookup[result.attributes.Agency] = result.attributes.Description;
  });

  return features.map(feature => {
    return {
      ...feature,
      Description: descriptionsLookup[feature.Agency]
    }
  });
};
