import React, { useState, useEffect, useRef } from 'react';
import getModules from '../esriModules';
import config from '../config';


export default props => {
  const [hasLegend, setHasLegend] = useState(false);
  const legend = useRef(null);

  useEffect(() => {
    const buildLegend = async renderer => {
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

    if (!hasLegend && props.renderer) {
      buildLegend(props.renderer);
    }
  }, [hasLegend, props.renderer, props.HazardUnit]);

  return (
    <div className="unit">
      <span ref={legend} className="unit__legend"></span>
      <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.Description] }}></p>
      <h4>How to Use This Map</h4>
      <p dangerouslySetInnerHTML={{ __html: props[config.fieldNames.HowToUse] }}></p>
    </div>
  );
};
