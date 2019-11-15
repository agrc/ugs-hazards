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
  queryReportTextTableAsync,
  queryOtherDataTableAsync
} from './services/QueryService';
import { getHazardCodeFromUnitCode } from './helpers';
import CoverPage from './reportParts/CoverPage';
import SummaryPage from './reportParts/SummaryPage';
import OtherDataPage from './reportParts/OtherDataPage';
import ProgressBar from './reportParts/ProgressBar';

const busyState = {}
config.queries.forEach((item) => busyState[item[0]] = false);
Object.values(config.urls).forEach((value, index) => {
  if (index === 0) {
    return;
  }

  busyState[value] = false;
});

const promiseAllWithProgress = (iterables, progress_callback) => {
  for (const promise of iterables) {
    promise.then((value) => {
      if (!(value.url in busyState)) {
        console.warn(`${value} not in query state`);

        return;
      }

      busyState[value.url] = true;

      progress_callback(busyState);
    });
  }

  return Promise.all(iterables);
};


export default props => {
  const [groupToHazardMap, setGroupToHazardMap] = useState({});
  const [hazardToUnitMap, setHazardToUnitMap] = useState({});
  const [hazardIntroText, setHazardIntroText] = useState();
  const [hazardReferences, setHazardReferences] = useState();
  const [queriesWithResults, setQueriesWithResults] = useState([]);
  const [groupToTextMap, setGroupToTextMap] = useState([]);
  const [reportTextMap, setReportTextMap] = useState({});
  const [otherDataMap, setOtherDataMap] = useState({});
  const [tasks, updateTasks] = useState(busyState);

  useEffect(() => {
    const getData = async () => {
      console.log('App.getData');
      const allHazardInfos = await promiseAllWithProgress(config.queries.map(urlCodeMap => queryUnitsAsync(urlCodeMap, props.polygon)), updateTasks);

      console.log('queried all units');

      const hazardInfos = allHazardInfos.filter(({ units }) => units.length > 0);
      const flatUnitCodes = Array.from(new Set(hazardInfos.reduce((previous, { units }) => previous.concat(units), [])));
      setQueriesWithResults(hazardInfos.map(info => [info.url, info.hazard]));

      // these queries can be done simultaneously
      const [
        groupings,
        hazardIntroText,
        hazardUnitText,
        hazardReferences,
        reportTextRows,
        otherDataRows
      ] = await promiseAllWithProgress([
        queryGroupingAsync(flatUnitCodes),
        queryIntroTextAsync(flatUnitCodes),
        queryHazardUnitTableAsync(flatUnitCodes),
        queryReferenceTableAsync(flatUnitCodes),
        queryReportTextTableAsync(),
        queryOtherDataTableAsync()
      ], updateTasks);

      const otherDataMapBuilder = {};
      otherDataRows.results.forEach(row => {
        otherDataMapBuilder[row.Data] = row;
      });
      setOtherDataMap(otherDataMapBuilder);

      const reportTextMapBuilder = {};
      reportTextRows.results.forEach(({ Section, Text }) => {
        reportTextMapBuilder[Section] = Text;
      });
      setReportTextMap(reportTextMapBuilder);

      const flatGroups = Array.from(new Set(groupings.results.map(({ HazardGroup }) => HazardGroup)));
      const groupText = await queryGroupTextAsync(flatGroups);
      tasks[groupText.url] = true;

      const groupToTextMapBuilder = {};
      groupText.results.forEach(({ HazardGroup, Text }) => groupToTextMapBuilder[HazardGroup] = Text);

      const hazardToUnitMapBuilder = {};
      hazardUnitText.results.forEach(({ HazardUnit, HazardName, HowToUse, Description }) => {
        const hazardCode = getHazardCodeFromUnitCode(HazardUnit);

        if (!hazardToUnitMapBuilder[hazardCode]) {
          hazardToUnitMapBuilder[hazardCode] = [];
        }

        hazardToUnitMapBuilder[hazardCode].push({ HazardName, HowToUse, Description, HazardUnit });
      });

      const groupToHazardMapBuilder = {}
      groupings.results.forEach(({ HazardCode, HazardGroup }) => {
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
  }, [tasks, props.polygon]);

  return (<>
    <ProgressBar className="print--hide" tasks={tasks} totalThingsToTrack={100}>
      <div className="print-button">
        <button onClick={window.print}>Print Report</button>
      </div>
    </ProgressBar>
    <CoverPage aoiDescription={props.description} {...reportTextMap} />
    <SummaryPage {...reportTextMap} />
    <HazardMap aoi={props.polygon} queriesWithResults={queriesWithResults}>
      {Object.keys(groupToHazardMap).map(groupName => (
        <Group key={groupName} name={groupName} text={groupToTextMap[groupName]}>
          {hazardIntroText && hazardReferences && hazardToUnitMap && groupToHazardMap[groupName].map(hazardCode => {
            const intro = hazardIntroText.results.filter(x => x.Hazard === hazardCode)[0];
            const introText = (intro) ? intro.Text : null;
            const references = hazardReferences.results.filter(x => x.Hazard === hazardCode);
            const units = hazardToUnitMap[hazardCode];
            // add number of maps to task list
            // units.forEach(unit => tasks[unit.HazardName] = false);
            // updateTasks(busyState);

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
    <OtherDataPage {...otherDataMap['Lidar Elevation Data']}>
      {"<lidar-specific stuff>"}
    </OtherDataPage>
    <OtherDataPage {...otherDataMap['Aerial Photography and Imagery']}>
      {"<imagery-specific stuff>"}
    </OtherDataPage>
    <div className="header page-break">
      <h1>OTHER GEOLOGIC HAZARD RESOURCES</h1>
      <p dangerouslySetInnerHTML={{ __html: reportTextMap.OtherResources }}
        title={config.notProd && 'ReportTextTable.Text(OtherResources)'}></p>
    </div>
  </>);
};
