import React, { useState, useEffect } from 'react';
import config from './config';
import getModules from './esriModules';
import './Unit.scss';


export default props => {
  const [legendHtml, setLegendHtml] = useState(null);

  useEffect(() => {
    const buildLegend = async renderer => {
      const { symbolUtils } = await getModules();
      let renderers = [];

      if (renderer.type === 'unique-value') {
        renderers = renderer.uniqueValueInfos.filter(info => info.value === props.unitCode);
      }

      if (renderers.length !== 1) {
        return;
      }

      const symbol = renderers[0].symbol;

      const element = await symbolUtils.renderPreviewHTML(symbol);

      setLegendHtml(element);
    };

    if (!legendHtml && props.renderer) {
      buildLegend(props.renderer);
    }
  }, [legendHtml, props.renderer, props.unitCode]);

  return (
    <div className="unit">
      {legendHtml ?
        <span dangerouslySetInnerHTML={{ __html: legendHtml.outerHTML }}></span>
      : null}
      <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.Description] }}></p>
      <h3>How to Use This Map</h3>
      <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.HowToUse] }}></p>
    </div>
  );
};
