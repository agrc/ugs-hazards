import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import polygonJson from './testPolygon.json';


console.log(`app version: ${process.env.REACT_APP_VERSION || 'dev'}`);
console.log(`environment: ${process.env.REACT_APP_ENVIRONMENT}`);

ReactDOM.render(<App aoi={polygonJson} />, document.getElementById('root'));
