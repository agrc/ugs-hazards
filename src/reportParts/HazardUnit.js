import React, { useState, useEffect, useRef, useContext } from 'react';
import getModules from '../esriModules';
import config from '../config';
import { HazardMapContext } from './HazardMap';
import { getHazardCodeFromUnitCode } from '../helpers';
import './HazardUnit.scss';


export default props => {
  console.log('HazardUnit', props);
  const [hasLegend, setHasLegend] = useState(false);
  const legend = useRef(null);
  const mapContext = useContext(HazardMapContext);

  useEffect(() => {
    const buildLegend = async renderer => {
      console.log('buildLegend', renderer);
      const { symbolUtils } = await getModules();
      let renderers = [];

      if (renderer.type === 'unique-value') {
        renderers = renderer.uniqueValueInfos.filter(info => info.value === props.HazardUnit);
      }

      if (renderers.length !== 1) {
        return;
      }

      const symbol = renderers[0].symbol.clone();

      await symbolUtils.renderPreviewHTML(symbol, {
        node: legend.current
      });

      setHasLegend(true);
    };

    console.log('mapContext', mapContext);
    const assets = mapContext.visualAssets[getHazardCodeFromUnitCode(props.HazardUnit)];
    if (!hasLegend && assets) {
      buildLegend(assets.renderer);
    }
  }, [hasLegend, props.HazardUnit, mapContext]);

  return (
    <div className="unit">
      <span ref={legend} className="unit__legend"></span>
      <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.Description] }}
        title={config.notProd && 'HazardUnitTextTable.Description'}></p>
      <h4>How to Use This Map</h4>
      <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.HowToUse] }}
        title={config.notProd && 'HazardUnitTextTable.HowToUse'}></p>
    </div>
  );
};
