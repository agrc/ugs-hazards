import React, { useRef, useContext, useEffect } from 'react';
import getModules from '../esriModules';
import { HazardMapContext } from './HazardMap';
import './MapSurround.scss';


export default ({ mapImage }) => {
  const scaleBarRef = useRef();
  const { mapView } = useContext(HazardMapContext);

  useEffect(() => {
    const setUpScaleBar = async () => {
      const { ScaleBar } = await getModules();

      new ScaleBar({
        view: mapView,
        container: scaleBarRef.current,
        // unit: 'dual'
        style: 'ruler'
      });
    }

    // get map view from context
    // require and set up the widget
    if (mapImage) {
      setUpScaleBar();
    }
  }, [mapImage, mapView]);

  return (
    <>
      <img src={mapImage} alt="map" className="hazard__image" />
      <div className="map-surround__parts">
        <div ref={scaleBarRef}></div>
        <div>Scale 1:{Math.round(mapView.scale).toLocaleString()}</div>
      </div>
    </>
  );
};
