import React, { useState, useEffect } from 'react';
import './App.scss';
import config from './config';
import HazardMap from './reportParts/HazardMap';
import Group from './reportParts/Group';
import Hazard from './reportParts/Hazard';
import HazardUnit from './reportParts/HazardUnit';
import References from './reportParts/References';
import {
  queryUnitsAsync,
  queryHazardUnitTableAsync,
  queryReferenceTableAsync,
  queryIntroTextAsync,
  queryGroupingAsync,
  queryGroupTextAsync,
  queryReportTextTableAsync
} from './services/QueryService';
import { getHazardCodeFromUnitCode } from './helpers';
import CoverPage from './reportParts/CoverPage';


export default props => {
  const [groupToHazardMap, setGroupToHazardMap] = useState({});
  const [hazardToUnitMap, setHazardToUnitMap] = useState({});
  const [hazardIntroText, setHazardIntroText] = useState();
  const [hazardReferences, setHazardReferences] = useState();
  const [queriesWithResults, setQueriesWithResults] = useState([]);
  const [groupToTextMap, setGroupToTextMap] = useState([]);
  const [reportTextMap, setReportTextMap] = useState({});

  useEffect(() => {
    const getData = async () => {
      console.log('App.getData');
      const allHazardInfos = await Promise.all(config.queries.map(featureClassMap => {
        return queryUnitsAsync(featureClassMap, props.polygon);
      }));

      console.log('queried all units');

      const hazardInfos = allHazardInfos.filter(({ units }) => units.length > 0);
      const flatUnitCodes = hazardInfos.reduce((previous, { units }) => previous.concat(units), []);
      setQueriesWithResults(hazardInfos.map(info => [info.url, info.hazard]));

      // these queries can be done simultaneously
      const [
        groupings,
        hazardIntroText,
        hazardUnitText,
        hazardReferences,
        reportTextRows
      ] = await Promise.all([
        queryGroupingAsync(flatUnitCodes),
        queryIntroTextAsync(flatUnitCodes),
        queryHazardUnitTableAsync(flatUnitCodes),
        queryReferenceTableAsync(flatUnitCodes),
        queryReportTextTableAsync()
      ]);

      const reportTextMapBuilder = {};
      reportTextRows.forEach(({ Section, Text }) => {
        reportTextMapBuilder[Section] = Text;
      });
      setReportTextMap(reportTextMapBuilder);

      const flatGroups = groupings.map(({ HazardGroup }) => HazardGroup);
      const groupText = await queryGroupTextAsync(flatGroups);

      const groupToTextMapBuilder = {};
      groupText.forEach(({ HazardGroup, Text }) => groupToTextMapBuilder[HazardGroup] = Text);

      const hazardToUnitMapBuilder = {};
      hazardUnitText.forEach(({ HazardUnit, HazardName, HowToUse, Description }) => {
        const hazardCode = getHazardCodeFromUnitCode(HazardUnit);

        if (!hazardToUnitMapBuilder[hazardCode]) {
          hazardToUnitMapBuilder[hazardCode] = [];
        }

        hazardToUnitMapBuilder[hazardCode].push({ HazardName, HowToUse, Description, HazardUnit });
      });

      const groupToHazardMapBuilder = {}
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
      setGroupToTextMap(groupToTextMapBuilder);
    };

    if (props.polygon) {
      getData();
    }
  }, [props.polygon]);

  return (<>
    <button className="hide-for-print print-button" onClick={window.print}>Print Report</button>
    <CoverPage aoiDescription={props.description} {...reportTextMap} />
    <HazardMap aoi={props.polygon} queriesWithResults={queriesWithResults}>
     {Object.keys(groupToHazardMap).map(groupName => (
        <Group key={groupName} name={groupName} text={groupToTextMap[groupName]}>
          {hazardIntroText && hazardReferences && hazardToUnitMap && groupToHazardMap[groupName].map(hazardCode => {
            const introText = hazardIntroText.filter(x => x.Hazard === hazardCode)[0].Text;
            const references = hazardReferences.filter(x => x.Hazard === hazardCode);
            const units = hazardToUnitMap[hazardCode];
                return (
                  <Hazard name={units[0].HazardName} introText={introText}
                    key={hazardCode} code={hazardCode}>
                    { units.map((unit, index) => <HazardUnit key={index} {...unit}/>) }
                    <References references={references.map(({ Text }) => Text)}></References>
                  </Hazard>
                )
              })}
        </Group>
      ))}
    </HazardMap>
  </>);
};
