import React, { useState } from 'react';
import { stringify } from 'query-string';
import config from './config';
import Unit from './Unit';
import './Hazard.scss';


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

  const getUnitAttribute = async units => {
    const unitCodes = units.map(unit => unit[`${code}HazardUnit`]);

    const parameters = {
      ...defaultParameters,
      where: `${config.fieldNames.HazardUnit} IN ('${unitCodes.join('\',\'')}')`
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

  return (
    <div className="hazard">
      <h2>{attributedUnits && attributedUnits[0][config.fieldNames.HazardName]}</h2>
      <p>{hazardText && hazardText.intro}</p>
      { props.imageSrc && <img src={props.imageSrc} alt="map" style={{width: '100%', minHeight: '200px'}} /> }
      <h3>Explanation of Map Units</h3>
      { attributedUnits && attributedUnits.map((unit, index) =>
        <Unit key={index} {...unit} />
        )}
      <h3>References</h3>
      {references && references.map((reference, index) => <p key={index} dangerouslySetInnerHTML={{ __html: reference }}></p>)}
    </div>
  );
};
