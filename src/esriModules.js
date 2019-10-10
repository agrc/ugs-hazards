import { loadModules } from 'esri-loader';


export default async () => {
  const requires = [
    'esri/WebMap',
    'esri/views/MapView',
    'esri/geometry/Polygon',
    'esri/Graphic',
    'esri/core/watchUtils'
  ];

  const [
    WebMap,
    MapView,
    Polygon,
    Graphic,
    watchUtils
  ] = await loadModules(requires, { css: true });

  return {
    WebMap, MapView, Polygon, Graphic, watchUtils
  };
};
