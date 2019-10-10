import React, { useState, useEffect, useContext } from 'react';
import { loadModules } from 'esri-loader';
import config from './config';
import AoiContext from './AoiContext';
import Hazard from './Hazard';


// we tried moving these to useRef but the code silently failed at map.current.when()
let map;
let view;
export default props => {
  const [ mapLoading, setMapLoading ] = useState(false);
  const [ mapLoaded, setMapLoaded ] = useState(false);
  const [ screenshots, setScreenshots ] = useState([]);

  const aoi = useContext(AoiContext);

  const createMap = async () => {
    console.log('HazardMap.createMap', props.hazards);

    setMapLoading(true);

    const requires = [
      'esri/WebMap',
      'esri/views/MapView',
      'esri/geometry/Polygon',
      'esri/Graphic'
    ];

    const [ WebMap, MapView, Polygon, Graphic ] = await loadModules(requires, { css: true });

    const mapDiv = document.createElement('div');
    mapDiv.style = 'position: absolute; left: -5000px; width: 1000px; height: 500px';
    document.body.appendChild(mapDiv);

    const polylineSymbol = {
      type: 'simple-line',
      color: [226, 119, 40],
      width: 4
    };

    const polygon = new Polygon(aoi);

    const polylineGraphic = new Graphic({
      geometry: polygon,
      symbol: polylineSymbol
    });

    map = new WebMap({
      portalItem: { id: config.webMaps.hazard }
    });
    console.log('map created');

    view = new MapView({
      map,
      container: mapDiv,
      ui: {
        components: ['attribution']
      },
      extent: polygon.extent.expand(3)
    });

    view.graphics.add(polylineGraphic);

    setMapLoaded(true);
  }

  useEffect(() => {
    const getScreenshots = async () => {
      const newScreenshots = [];
      for (let index = 0; index < props.hazards.length; index++) {
        const hazard = props.hazards[index];
        const screenshot = await getScreenshot(hazard.url);
        newScreenshots.push(screenshot.dataUrl);
      }

      setScreenshots(newScreenshots);
    };

    if (mapLoaded && props.hazards.length > 0) {
      getScreenshots();
    }
  }, [props.hazards, mapLoaded]);

  if (!mapLoading) {
    createMap();
  }

  return (
    <>
      { props.hazards.map((hazard, index) => <Hazard key={index} {...hazard} imageSrc={screenshots[index]} />) }
    </>
  );
};

const getScreenshot = async function(url) {
  console.log('HazardMap.getScreenshot');

  await map.when();
  map.layers.forEach(layer => layer.visible = new RegExp(`${url}$`).test(`${layer.url}/${layer.layerId}`));

  await view.when();
  const [ watchUtils ] = await loadModules(['esri/core/watchUtils']);
  await watchUtils.whenFalseOnce(view, 'updating');

  const screenshot = await view.takeScreenshot({width: 2000, height: 1000});

  return screenshot;
};
