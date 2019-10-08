import React, { useState, useRef, useEffect, useContext } from 'react';
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
export default ({ units, code }) => {
  console.log('Hazard', code, units);

  const [ attributedUnits, setAttributedUnits ] = useState();
  const [ hazardText, setHazardText ] = useState();

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

  const mapDivRef = useRef();

  const aoi = useContext(AoiContext);
  useEffect(() => {
    const loadMap = async id => {
      const requires = ['esri/WebMap', 'esri/views/MapView', 'esri/geometry/Polygon'];

      const [ WebMap, MapView, Polygon ] = await loadModules(requires, { css: true });

      const map = new WebMap({
        portalItem: { id }
      });
      console.log('aoi', aoi);
      const view = new MapView({
        map,
        container: mapDivRef.current,
        ui: {
          // exclude zoom controls
          components: ['attribution']
        },
        extent: new Polygon(aoi).extent
      });

      await view.when();

      // disable navigation events - this is a little crazy
      view.on('mouse-wheel', event => {
        event.stopPropagation();
      });
      view.on('double-click', event => {
        event.stopPropagation();
      });
      view.on('double-click', ['Control'], event => {
        event.stopPropagation();
      });
      view.on('drag', event => {
        event.stopPropagation();
      });
      view.on('drag', ['Shift'], event => {
        event.stopPropagation();
      });
      view.on('drag', ['Shift', 'Control'], event => {
        event.stopPropagation();
      });
      view.on('click', event => {
        event.stopPropagation();
      });
    }

    if (config.webMaps[code]) {
      loadMap(config.webMaps[code]);
    }
  }, [mapDivRef, code, aoi]);

  return (
    <div className="hazard">
      <h2>{attributedUnits && attributedUnits[0][config.fieldNames.HazardName]}</h2>
      <p>{hazardText && hazardText.intro}</p>
      <div ref={mapDivRef}></div>
      { attributedUnits && attributedUnits.map((unit, index) =>
        <Unit key={index} {...unit} />
      )}
      <h3>References</h3>
      { references && references.map((reference, index) => <p key={index}>{reference}</p>)}
    </div>
  );
};
