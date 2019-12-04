import React, { useContext } from 'react';
import { HazardMapContext } from './HazardMap';
import config from '../config';
import Loader from './Loader';
import './Hazard.scss';
import { kebabCase } from 'lodash';


export default props => {
  console.log('Hazard.render', props);

  const mapContext = useContext(HazardMapContext);
  const visualAssets = mapContext.visualAssets[props.code];

  return (
    <div className="page-break" id={kebabCase(props.name)}>
      <h2 className="group__heading" title={config.notProd && 'HazardGroupingsTable.HazardGroup (from parent)'}>{props.group}</h2>
      <h2 className="hazard__heading" title={config.notProd && 'HazardUnitTextTable.HazardName (from first unit)'}>{props.name}</h2>
      <p dangerouslySetInnerHTML={{ __html: props.introText }} title={config.notProd && 'HazardIntroTextTable.Text'}></p>
      { visualAssets ? <img src={visualAssets.mapImage}
        alt="map" className="hazard-map-image" /> : <Loader /> }
      {props.children}
    </div>
  );
};
