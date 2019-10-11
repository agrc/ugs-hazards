import React, { useContext } from 'react';
import { HazardMapContext } from './HazardMap';
import config from '../config';


export default props => {
  console.log('Hazard.render', props);

  const mapContext = useContext(HazardMapContext);
  const visualAssets = mapContext.visualAssets[props.code];

  return (
    <>
      <h2 title={config.notProd && 'HazardUnitTextTable.HazardName (from first unit)'}>{props.name}</h2>
      <p dangerouslySetInnerHTML={{ __html: props.introText }} title={config.notProd && 'HazardIntroTextTable.Text'}></p>
      { visualAssets && <img src={visualAssets.mapImage}
        alt="map" style={{width: '100%', minHeight: '200px'}} /> }
      {props.children}
    </>
  );
};
