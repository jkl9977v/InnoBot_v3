import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App'
import './index.css';

/*
ReactDOM.createRoot(document.getElmementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
