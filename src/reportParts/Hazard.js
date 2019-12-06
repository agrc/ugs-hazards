import React, { useContext } from 'react';
import { HazardMapContext } from './HazardMap';
import config from '../config';
import Loader from './Loader';
import { kebabCase } from 'lodash';
import './Hazard.scss';
import MapSurround from './MapSurround';


export default props => {
  const mapContext = useContext(HazardMapContext);
  const visualAssets = mapContext.visualAssets[props.code];

  return (
    <div className="page-break" id={kebabCase(props.name)}>
      <h2 className="group__heading" title={config.notProd && 'HazardGroupingsTable.HazardGroup (from parent)'}>{props.group}</h2>
      <h2 className="hazard__heading" title={config.notProd && 'HazardUnitTextTable.HazardName (from first unit)'}>{props.name}</h2>
      <p dangerouslySetInnerHTML={{ __html: props.introText }} title={config.notProd && 'HazardIntroTextTable.Text'}></p>
      { visualAssets ? <MapSurround mapImage={visualAssets.mapImage} /> : <Loader /> }
      {props.children}
    </div>
  );
};
