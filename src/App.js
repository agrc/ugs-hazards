import React, { useState } from 'react';
import './App.scss';
import config from './config';
import AoiContext from './AoiContext';
import HazardMap from './HazardMap';
import Group from './reportParts/Group';
import Hazard from './reportParts/Hazard';
import HazardUnit from './reportParts/HazardUnit';
import IntroText from './reportParts/IntroText';
import References from './reportParts/References';
import {
  queryUnitsAsync,
  queryHazardUnitTableAsync,
  queryReferenceTableAsync,
  queryIntroTextAsync,
  queryGroupingAsync
} from './services/QueryService';


const defaultParameters = {
  geometryType: 'esriGeometryPolygon',
  returnGeometry: false,
  returnCentroid: false,
  spatialRel: 'esriSpatialRelIntersects',
  f: 'json'
};

// return (
//   <div className="app">
//     <AoiContext.Provider value={props.aoi}>
//       <h1>Input polygon</h1>
//       <p className="code">{JSON.stringify(props.aoi, null, 1)}</p>
//       <HazardMap hazards={hazards}></HazardMap>
//     </AoiContext.Provider>
//   </div>
// );

export default props => {
  const [groupToHazardMap, setGroupToHazardMap] = useState({});
  const [hazardToUnitMap, setHazardToUnitMap] = useState({});
  const [hazardIntroText, setHazardIntroText] = useState();
  const [hazardReferences, setHazardReferences] = useState();

  const getData = async () => {
    console.log('App.getData');
    const allHazardInfos = await Promise.all(config.queries.map(featureClassMap => {
      return queryUnitsAsync(featureClassMap, props.aoi);
    }));

    console.log('queried all units');

    const hazardInfos = allHazardInfos.filter(({ units }) => units.length > 0);
    const flatUnitCodes = hazardInfos.reduce((previous, { units }) => previous.concat(units), []);

    const groupings = await queryGroupingAsync(flatUnitCodes);
    const hazardIntroText = await queryIntroTextAsync(flatUnitCodes);
    const hazardUnitText = await queryHazardUnitTableAsync(flatUnitCodes);
    const hazardReferences = await queryReferenceTableAsync(flatUnitCodes);
    // const groupText = await queryGroupTextAsync(flatGroups);

    const hazardToUnitMapBuilder = {};
    hazardUnitText.forEach(({ HazardUnit, HazardName, HowToUse, Description }) => {
      const hazardCode = HazardUnit.slice(-3).toUpperCase();

      if (!hazardToUnitMapBuilder[hazardCode]) {
        hazardToUnitMapBuilder[hazardCode] = [];
      }

      hazardToUnitMapBuilder[hazardCode].push({ HazardName, HowToUse, Description, HazardUnit });
    });

    const groupToHazardMapBuilder = {}

    console.log('building grouping map');
    groupings.forEach(({ HazardCode, HazardGroup }) => {
      if (!groupToHazardMapBuilder[HazardGroup]) {
        groupToHazardMapBuilder[HazardGroup] = [];
      }

      groupToHazardMapBuilder[HazardGroup].push(HazardCode);
    });

    setHazardToUnitMap(hazardToUnitMapBuilder);
    setGroupToHazardMap(groupToHazardMapBuilder);
    setHazardIntroText(hazardIntroText);
    setHazardReferences(hazardReferences);
  };

  if (Object.keys(groupToHazardMap).length === 0) {
    getData();
  }

  return (<>
    {Object.keys(groupToHazardMap).map(groupName => (
      <Group name={groupName} text="TODO: Group Text">
        {hazardIntroText && hazardReferences && hazardToUnitMap && groupToHazardMap[groupName].map(hazardCode => {
          const introText = hazardIntroText.filter(x => x.Hazard === hazardCode)[0].Text;
          const references = hazardReferences.filter(x => x.Hazard === hazardCode);
          const units = hazardToUnitMap[hazardCode];
              return (
                <Hazard name={units[0].HazardName}>
                  <IntroText text={introText}></IntroText>
                  { units.map(unit => <HazardUnit {...unit}/>) }
                  {/* <HazardMap>
                <HazardUnit></HazardUnit>
              </HazardMap> */}
                  <References references={references.map(({ Text }) => Text)}></References>
                </Hazard>
              )
            })}
      </Group>
    ))}
  </>
  );
};
