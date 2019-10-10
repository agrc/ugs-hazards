import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import polygonJson from './testPolygon.json';


ReactDOM.render(<App aoi={polygonJson} />, document.getElementById('root'));
