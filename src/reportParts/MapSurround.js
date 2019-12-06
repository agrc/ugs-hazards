import React, { useRef, useContext, useEffect } from 'react';
import getModules from '../esriModules';
import { HazardMapContext } from './HazardMap';
import './MapSurround.scss';
import Loader from './Loader';


export default ({ mapKey }) => {
  const scaleBarRef = useRef();
  const { mapView, visualAssets } = useContext(HazardMapContext);
  const mapImage = visualAssets && visualAssets[mapKey] && visualAssets[mapKey].mapImage;

  useEffect(() => {
    const setUpScaleBar = async () => {
      const { ScaleBar } = await getModules();

      new ScaleBar({
        view: mapView,
        container: scaleBarRef.current,
        unit: 'dual'
      });
    }

    // get map view from context
    // require and set up the widget
    if (mapImage) {
      setUpScaleBar();
    }
  }, [mapImage, mapView]);

  if (mapImage) {
    return (
      <>
        <img src={mapImage} alt="map" className="map-surround__image" />
        <div className="map-surround__parts">
          <div ref={scaleBarRef}></div>
          <div className="map-surround__scale-text">Scale 1:{Math.round(mapView.scale).toLocaleString()}</div>
        </div>
      </>
    );
  }

  return (<Loader />);
};
