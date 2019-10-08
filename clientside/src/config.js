const baseUrl = 'https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services';
export default {
  urls: {
    baseUrl,
    hazardGroupingsTable: `${baseUrl}/Report_Tables_View/FeatureServer/0`,
    hazardIntroTextTable: `${baseUrl}/Report_Tables_View/FeatureServer/2`,
    hazardReferenceTextTable: `${baseUrl}/Report_Tables_View/FeatureServer/3`,
    hazardUnitTextTable: `${baseUrl}/Report_tables_View/FeatureServer/4`
  },
  queries: [
    // ['Utah_Geologic_Hazards/FeatureServer/0', '???'], // flood canyon
    ['Utah_Geologic_Hazards/FeatureServer/1', 'FLH'],
    ['Utah_Geologic_Hazards/FeatureServer/2', 'SGS'],
    ['Utah_Geologic_Hazards/FeatureServer/3', 'LSS'],
    // ['Utah_Geologic_Hazards/FeatureServer/4', '???'], // landslides
    // ['Utah_Geologic_Hazards/FeatureServer/5', 'LSUnit'], // legacy landslide
    ['Utah_Geologic_Hazards/FeatureServer/6', 'CAS'],
    ['Utah_Geologic_Hazards/FeatureServer/7', 'CSS'],
    ['Utah_Geologic_Hazards/FeatureServer/8', 'CRS'],
    ['Utah_Geologic_Hazards/FeatureServer/9', 'EFH'],
    ['Utah_Geologic_Hazards/FeatureServer/10', 'ERZ'],
    ['Utah_Geologic_Hazards/FeatureServer/11', 'EXS'],
    ['Utah_Geologic_Hazards/FeatureServer/12', 'GSP'],
    ['Utah_Geologic_Hazards/FeatureServer/13', 'MKF'],
    ['Utah_Geologic_Hazards/FeatureServer/14', 'PES'],
    ['Utah_Geologic_Hazards/FeatureServer/15', 'GRS'],
    ['Utah_Geologic_Hazards/FeatureServer/16', 'RFH'],
    ['Utah_Geologic_Hazards/FeatureServer/17', 'SDH'],
    ['Utah_Geologic_Hazards/FeatureServer/18', 'SBP'],
    ['Utah_Geologic_Hazards/FeatureServer/19', 'SLS'],
    ['Utah_Geologic_Hazards/FeatureServer/20', 'WSS'],
    // ['Utah_Earthquake_Hazards/FeatureServer/0', '??'], // utah epicenters
    // ['Utah_Earthquake_Hazards/FeatureServer/1', '??'], // mining-induced epicenters
    // ['Utah_Earthquake_Hazards/FeatureServer/2', '??'], // quaternary faults
    ['Utah_Earthquake_Hazards/FeatureServer/3', 'LQS'],
    ['Utah_Earthquake_Hazards/FeatureServer/4', 'SFR'],
  ],
  fieldNames: {
    // common
    HazardUnit: 'HazardUnit',
    HazardName: 'HazardName',
    Hazard: 'Hazard',
    Text: 'Text',

    // HazardUnitTextTable
    Description: 'Description',
    HowToUse: 'HowToUse',
  }
};
