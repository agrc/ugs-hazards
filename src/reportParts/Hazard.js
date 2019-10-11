import React, { useContext } from 'react';
import { HazardMapContext } from './HazardMap';


export default props => {
  console.log('Hazard.render', props);

  const mapContext = useContext(HazardMapContext);
  const visualAssets = mapContext.visualAssets[props.code];

  return (
    <>
      <h3>{props.name}</h3>
      <p dangerouslySetInnerHTML={{ __html: props.introText }} title='test title'></p>
      { visualAssets && <img src={visualAssets.mapImage}
        alt="map" style={{width: '100%', minHeight: '200px'}} /> }
      {props.children}
    </>
  );
};
