import React, { useContext } from 'react';
import ugsLogo from '../images/ugs-logo.jpg';
import config from '../config';
import './CoverPage.scss';
import { HazardMapContext } from './HazardMap';
import Loader from './Loader';


export default ({ aoiDescription, aoi, Introduction, Disclaimer }) => {
  const mapContext = useContext(HazardMapContext);
  const visualAssets = mapContext.visualAssets[config.overviewMapKey];

  return (
    <div className="cover-page">
      <div className="header">
        <h1>Utah Geological Survey</h1>
        <img src={ugsLogo} alt="dnr logo" className="logo" />
        <h3>GEOLOGIC HAZARDS MAPPING AND DATA CUSTOM REPORT</h3>
        <h3 title={config.notProd && 'from "description" property of input data'}>for {aoiDescription}</h3>
      </div>
      <p dangerouslySetInnerHTML={{ __html: Introduction }}
        title={config.notProd && 'ReportTextTable.Text(Introduction)'}></p>
      { visualAssets ? <img src={visualAssets.mapImage}
        alt="map" className="hazard-map-image" /> : <Loader /> }
      <p dangerouslySetInnerHTML={{ __html: Disclaimer }}
        title={config.notProd && 'ReportTextTable.Text(Disclaimer)'}></p>
    </div>
  );
};
