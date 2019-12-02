import { loadModules } from 'esri-loader';


export default async () => {
  const requires = [
    'esri/WebMap',
    'esri/views/MapView',
    'esri/geometry/Polygon',
    'esri/Graphic',
    'esri/core/watchUtils',
    'esri/symbols/support/symbolUtils'
  ];

  const [
    WebMap,
    MapView,
    Polygon,
    Graphic,
    watchUtils,
    symbolUtils
  ] = await loadModules(requires, {
    version: '4.13',
    css: true
  });

  return {
    WebMap, MapView, Polygon, Graphic, watchUtils, symbolUtils
  };
};
