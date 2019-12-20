import React, { useContext, useState, useEffect, createContext } from 'react';
import config from '../config';
import getModules from '../esriModules';
import { ProgressContext } from '../App';


export const HazardMapContext = createContext({
  visualAssets: {}
});

// we tried moving these to useRef but the code silently failed at map.current.when()
let map;
let view;
let scaleBar;

export default props => {
  console.log('HazardMap.render', props);
  const [ visualAssets, setVisualAssets ] = useState({});
  const [ mapLoading, setMapLoading ] = useState(false);
  const [ mapLoaded, setMapLoaded ] = useState(false);
  const { registerProgressItem, setProgressItemAsComplete } = useContext(ProgressContext);

  const createMap = async () => {
    console.log('HazardMap.createMap');

    setMapLoading(true);

    const { WebMap, MapView, Polygon, Graphic, ScaleBar } = await getModules();

    const mapDiv = document.createElement('div');
    mapDiv.style = 'position: absolute; left: -5000px; width: 1000px; height: 500px';
    document.body.appendChild(mapDiv);

    const polylineSymbol = {
      type: 'simple-line',
      color: '#f012be',
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
      extent: polygon.extent.expand(3),
      graphics: [ polylineGraphic ],
      constraints: {
        snapToZoom: false
      }
    });

    // make map scale a multiple of 2500
    await view.when();
    const remainder = view.scale % config.scaleMultiple;
    view.scale += config.scaleMultiple - remainder;

    scaleBar = new ScaleBar({
      view,
      container: document.createElement('div'),
      unit: 'dual'
    });

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
        const { screenshot, renderer, scale, scaleBarDom } = await getScreenshot(url, hazardCode);
        setProgressItemAsComplete(getProgressId(url));

        newScreenshots[hazardCode] = {
          mapImage: screenshot.dataUrl,
          renderer,
          scale,
          scaleBarDom
        };
      }

      const getExtraScreenshot = async (key, url) => {
        // generate overview map
        const { screenshot, scale, scaleBarDom } = await getScreenshot(url);
        newScreenshots[key] = { mapImage: screenshot.dataUrl, scale, scaleBarDom };
        setProgressItemAsComplete(getProgressId(key));
      };

      await getExtraScreenshot(config.mapKeys.overview);
      await getExtraScreenshot(config.mapKeys.lidar, config.urls.lidarExtents);
      await getExtraScreenshot(config.mapKeys.aerials, config.urls.aerialImageryCenterPoints);

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

const getScreenshot = async function(url, hazardCode) {
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

  const { watchUtils } = await getModules();

  let originalScale;
  if (hazardCode === config.groundshakingHazardCode) {
    originalScale = view.scale;

    // goTo works better than setting the scale prop directly since we can await it
    await view.goTo({
      scale: view.scale * 2
    });
  }

  await watchUtils.whenFalseOnce(view, 'updating');

  const screenshot = await view.takeScreenshot({width: 2550, height: 1576});
  // cache scale bar dom since it could be different for different maps
  const scaleBarDom = scaleBar.container.cloneNode(true);
  const scale = view.scale;

  if (originalScale) {
    await view.goTo({
      scale: originalScale
    });
  }

  console.log('view.scale', scale, hazardCode);
  return { screenshot, renderer, scale, scaleBarDom };
};
