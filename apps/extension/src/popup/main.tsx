import React from 'react';
import ReactDOM from 'react-dom/client';
import '@biblio/ui/styles.css';
import { Popup } from './popup.js';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
