const baseUrl = 'https://services.arcgis.com/ZzrwjTRez6FJiOq4/arcgis/rest/services';
export default {
  notProd: process.env.REACT_APP_ENVIRONMENT !== 'production',
  urls: {
    baseUrl,
    hazardGroupingsTable: `${baseUrl}/Report_Tables_View/FeatureServer/0`,
    hazardGroupTextTable: `${baseUrl}/Report_Tables_View/FeatureServer/1`,
    hazardIntroTextTable: `${baseUrl}/Report_Tables_View/FeatureServer/2`,
    hazardReferenceTextTable: `${baseUrl}/Report_Tables_View/FeatureServer/3`,
    hazardUnitTextTable: `${baseUrl}/Report_Tables_View/FeatureServer/4`,
    otherDataTable: `${baseUrl}/Report_Tables_View/FeatureServer/7`,
    reportTextTable: `${baseUrl}/Report_Tables_View/FeatureServer/8`
  },
  queries: [
    ['Utah_Geologic_Hazards/FeatureServer/1', 'FLH'], // Flood Hazard
    ['Utah_Geologic_Hazards/FeatureServer/2', 'SGS'], // Shallow Groundwater Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/3', 'LSS'], // Landslide Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/4', 'LSF'], // landslides
    ['Utah_Geologic_Hazards/FeatureServer/6', 'CAS'], // Caliche Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/7', 'CSS'], // Collapsible Soil Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/8', 'CRS'], // Corrosive Soil and Rock Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/9', 'EFH'], // Earth Fissure Hazard
    ['Utah_Geologic_Hazards/FeatureServer/10', 'ERZ'], // Erosion Hazard Zones
    ['Utah_Geologic_Hazards/FeatureServer/11', 'EXS'], // Expansive Soil and Rock Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/12', 'GSP'], // Ground Subsidence Potential
    ['Utah_Geologic_Hazards/FeatureServer/13', 'MKF'], // Karst Features
    ['Utah_Geologic_Hazards/FeatureServer/14', 'PES'], // Piping and Erosion Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/15', 'GRS'], // Radon Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/16', 'RFH'], // Rockfall Hazard
    ['Utah_Geologic_Hazards/FeatureServer/17', 'SDH'], // Salt Tectonics Related Ground Deformation
    ['Utah_Geologic_Hazards/FeatureServer/18', 'SBP'], // Shallow Bedrock Potential
    ['Utah_Geologic_Hazards/FeatureServer/19', 'SLS'], // Soluble Soil and Rock Susceptibility
    ['Utah_Geologic_Hazards/FeatureServer/20', 'WSS'], // Wind-Blown Sand Susceptibility
    // ['Utah_Earthquake_Hazards/FeatureServer/0', '??'], // utah epicenters
    // ['Utah_Earthquake_Hazards/FeatureServer/1', '??'], // mining-induced epicenters
    // ['Utah_Earthquake_Hazards/FeatureServer/2', '??'], // quaternary faults
    ['Utah_Earthquake_Hazards/FeatureServer/3', 'LQS'], // Liquefaction Susceptibility
    ['Utah_Earthquake_Hazards/FeatureServer/4', 'SFR'], // Surface Fault Rupture Hazard Special Study Zone
  ],
  webMaps: {
    hazard: '895afaac7ee04933b91ee9dd1f88c823'
  }
};
