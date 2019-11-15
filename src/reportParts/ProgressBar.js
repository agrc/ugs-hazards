import React from 'react';
import classNames from 'classnames';
import './ProgressBar.scss';
import { CombineLatestOperator } from '../../../../Library/Caches/typescript/3.6/node_modules/rxjs/internal/observable/combineLatest';


export default props => {
  console.log('Progress.render');

  const values = Object.values(props.tasks);
  const max = values.length
  const completed = values.filter(x => x).length;
  const percent = ((completed / max) * 100);

  const classes = classNames(
    "progress-bar",
    "progress-bar--striped",
    { "progress-bar--animated": max > completed }
  );

  const parentClasses = classNames(
    props.className
  )

  return (<div className={parentClasses}>
    <div className="progress">
      <div className={classes}
        style={{ width: `${percent}%` }}
        role="progressbar"
        area-valuenow={percent}
        aria-valuemin="0"
        aria-valuemax={max}
      ></div>
    </div>
    {max <= completed ? props.children : null}
  </div>
  );

  // return max <= completed ? props.children :
  //   (<>
  //     <div className="progress">
  //       <div className="progress-bar progress-bar--striped progress-bar--animated"
  //         style={{ width: `${percent}%` }}
  //         role="progressbar"
  //         area-valuenow={percent}
  //         aria-valuemin="0"
  //         aria-valuemax={max}
  //       ></div>
  //     </div>
  //   </>
  //   );
};
