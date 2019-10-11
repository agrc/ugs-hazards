import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import testDataJson from './testData.json';


console.log(`app version: ${process.env.REACT_APP_VERSION || 'dev'}`);
console.log(`environment: ${process.env.REACT_APP_ENVIRONMENT}`);

ReactDOM.render(<App {...testDataJson} />, document.getElementById('root'));
