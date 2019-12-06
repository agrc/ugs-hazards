import React, { useContext } from 'react';
import config from '../config';
import { HazardMapContext } from './HazardMap';
import Loader from './Loader';
import './OtherDataPage.scss';
import MapSurround from './MapSurround';


export default props => {
  const mapContext = useContext(HazardMapContext);
  const visualAssets = mapContext.visualAssets[props.mapKey];

  return (
    <div className="page-break" id={props.id}>
      <div className="header">
        <h2 className="group__heading">OTHER DATA</h2>
        <h2 className="other-data-page__heading">{props.Data}</h2>
      </div>
      <p dangerouslySetInnerHTML={{ __html: props.Introduction }}
        title={config.notProd && "OtherDataTable.Introduction"}></p>
      { visualAssets ? <MapSurround mapImage={visualAssets.mapImage} /> : <Loader /> }
      {props.children}
      <h4>How To Use This Map</h4>
      <p dangerouslySetInnerHTML={{ __html: props.HowToUse }}
        title={config.notProd && "OtherDataTable.HowToUse"}></p>
      { props.References_ &&
        <>
          <h4>References</h4>
          <p dangerouslySetInnerHTML={{ __html: props.References_ }}
            title={config.notProd && "OtherDataTable.References_"}></p>
        </>
      }
    </div>
  );
};
