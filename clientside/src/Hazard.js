import React, { useState, useEffect, useContext } from 'react';
import { stringify } from 'query-string';
import config from './config';
import Unit from './Unit';
import './Hazard.scss';
import { loadModules } from 'esri-loader';
import AoiContext from './AoiContext';


const defaultParameters = {
  outFields: '*',
  f: 'json'
};

export default (props) => {
  const code = props.hazardCode;
  const units = props.features;
  const url = props.url;

  console.log('Hazard', code, units, url);

  const [ attributedUnits, setAttributedUnits ] = useState();
  const [ hazardText, setHazardText ] = useState();
  const [ imageSrc, setImageSrc ] = useState();

  const getUnitAttribute = async units => {
    const unitCodes = units.map(unit => unit[`${code}HazardUnit`]);

    const parameters = {
      ...defaultParameters,
      where: `${config.fieldNames.HazardUnit} IN ('${unitCodes.join(', ')}')`
    };

    const response = await fetch(`${config.urls.hazardUnitTextTable}/query?${stringify(parameters)}`);
    const responseJson = await response.json();

    const unitLookup = {};
    responseJson.features.forEach(({ attributes }) => {
      unitLookup[attributes[config.fieldNames.HazardUnit]] = attributes;
    });

    const newAttributedUnits = Array.from(units).map(unit => {
      return {
        ...unit,
        ...unitLookup[unit[`${code}${config.fieldNames.HazardUnit}`]]
      };
    });

    setAttributedUnits(newAttributedUnits);
  };

  const getHazardText = async code => {
    const parameters = {
      ...defaultParameters,
      where: `${config.fieldNames.Hazard} = '${code}'`
    };

    const response = await fetch(`${config.urls.hazardIntroTextTable}/query?${stringify(parameters)}`);
    const responseJson = await response.json();

    setHazardText({
      intro: responseJson.features[0].attributes[config.fieldNames.Text]
    });
  };

  if (!attributedUnits) {
    getUnitAttribute(units);
  }

  if (!hazardText) {
    getHazardText(code);
  }

  const [ references, setReferences ] = useState();

  const getReferences = async code => {
    const parameters = {
      outFields: '*',
      f: 'json',
      where: `${config.fieldNames.Hazard} = '${code}'`
    };

    const response = await fetch(`${config.urls.hazardReferenceTextTable}/query?${stringify(parameters)}`);
    const responseJson = await response.json();

    setReferences(responseJson.features.map(feature => feature.attributes[config.fieldNames.Text]));
  }

  if (!references) {
    getReferences(code);
  }

  const aoi = useContext(AoiContext);
  useEffect(() => {
    const loadMap = async id => {
      console.log('loadMap');
      const requires = ['esri/WebMap',
        'esri/views/MapView',
        'esri/geometry/Polygon',
        'esri/core/watchUtils',
        'esri/Graphic'
      ];

      const [ WebMap, MapView, Polygon, watchUtils, Graphic ] = await loadModules(requires, { css: true });

      const mapDiv = document.createElement('div');
      mapDiv.style = 'position: absolute;left: -5000px;width: 1000px;height: 500px';
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

      const map = new WebMap({
        portalItem: { id }
      });

      console.log('map', map);
      const view = new MapView({
        map,
        container: mapDiv,
        ui: {
          components: ['attribution']
        },
        extent: polygon.extent.expand(3)
      });

      view.graphics.add(polylineGraphic);

      await map.when();
      map.layers.forEach(layer => layer.visible = new RegExp(`${url}$`).test(`${layer.url}/${layer.layerId}`));

      await view.when();
      await watchUtils.whenFalseOnce(view, 'updating');

      const screenshot = await view.takeScreenshot({width: 2000, height: 1000});
      setImageSrc(screenshot.dataUrl);

      console.log('screenshot set')

      view.container = view.map = null;
      document.body.removeChild(mapDiv);
    }

    loadMap(config.webMaps.hazard);
  }, [url, aoi]);

  return (
    <div className="hazard">
      <h2>{attributedUnits && attributedUnits[0][config.fieldNames.HazardName]}</h2>
      <p>{hazardText && hazardText.intro}</p>
      { imageSrc && <img src={imageSrc} alt="map" style={{width: '100%', minHeight: '200px'}} /> }
      { attributedUnits && attributedUnits.map((unit, index) =>
        <Unit key={index} {...unit} />
      )}
      <h3>References</h3>
      {references && references.map((reference, index) => <p key={index} dangerouslySetInnerHTML={{ __html: reference }}></p>)}
    </div>
  );
};
