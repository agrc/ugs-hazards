import React, { useContext, useState, useEffect, createContext } from 'react';
import config from '../config';
import getModules from '../esriModules';
import { ProgressContext } from '../App';
import './HazardMap.scss';


export const HazardMapContext = createContext({
  visualAssets: {}
});

// we tried moving these to useRef but the code silently failed at map.current.when()
let map;
let view;
export default props => {
  console.log('HazardMap.render', props);
  const [ visualAssets, setVisualAssets ] = useState({});
  const [ mapLoading, setMapLoading ] = useState(false);
  const [ mapLoaded, setMapLoaded ] = useState(false);
  const { registerProgressItem, setProgressItemAsComplete } = useContext(ProgressContext);

  const createMap = async () => {
    console.log('HazardMap.createMap');

    setMapLoading(true);

    const { WebMap, MapView, Polygon, Graphic } = await getModules();

    const mapDiv = document.createElement('div');
    mapDiv.style = 'position: absolute; left: -5000px; width: 1000px; height: 500px';
    document.body.appendChild(mapDiv);

    const polylineSymbol = {
      type: 'simple-line',
      color: [226, 119, 40],
      width: 4
    };

    const polygon = new Polygon(props.aoi);

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

  const getProgressId = url => `screenshot-${url}`;
  useEffect(() => {
    for (let index = 0; index < props.queriesWithResults.length; index++) {
      const [url] = props.queriesWithResults[index];

      registerProgressItem(getProgressId(url));
    }

    Object.keys(config.mapKeys).forEach(key => {
      registerProgressItem(getProgressId(config.mapKeys[key]));
    });
  }, [props.queriesWithResults, registerProgressItem]);

  useEffect(() => {
    const getScreenshots = async () => {
      console.log('getScreenshots', props.queriesWithResults);

      const newScreenshots = {};
      for (let index = 0; index < props.queriesWithResults.length; index++) {
        const [url, hazardCode] = props.queriesWithResults[index];
        const { screenshot, renderer } = await getScreenshot(url);
        setProgressItemAsComplete(getProgressId(url));

        newScreenshots[hazardCode] = {mapImage: screenshot.dataUrl, renderer};
      }

      const getExtraScreenshot = async (key, url) => {
        // generate overview map
        const { screenshot } = await getScreenshot(url);
        newScreenshots[key] = { mapImage: screenshot.dataUrl };
        setProgressItemAsComplete(getProgressId(key));
      };

      await getExtraScreenshot(config.mapKeys.overview);
      await getExtraScreenshot(config.mapKeys.lidar, config.urls.lidarExtents);
      await getExtraScreenshot(config.mapKeys.aerials, config.urls.aerialImageryCenterpoints);

      setVisualAssets(newScreenshots);
    };

    if (mapLoaded && props.queriesWithResults.length > 0) {
      getScreenshots();
    }
  }, [props.queriesWithResults, mapLoaded, setProgressItemAsComplete]);

  if (!mapLoading) {
    createMap();
  }

  return (
    <>
      <HazardMapContext.Provider value={{ visualAssets }}>
        {props.children}
      </HazardMapContext.Provider>
    </>
  );
};

const getScreenshot = async function(url) {
  console.log('HazardMap.getScreenshot', url);

  let renderer;

  await map.when();

  for (let index = 0; index < map.layers.length; index++) {
    const layer = map.layers.getItemAt(index);
    if (url) {
      layer.visible = new RegExp(`${url.toUpperCase()}$`).test(`${layer.url}/${layer.layerId}`.toUpperCase());
    } else {
      layer.visible = false;
    }

    if (layer.visible) {
      await layer.load();

      renderer = layer.renderer;
    };
  }

  await view.when();
  const { watchUtils } = await getModules();

  await watchUtils.whenFalseOnce(view, 'updating');

  const screenshot = await view.takeScreenshot({width: 2000, height: 1000});

  return {screenshot, renderer};
};
