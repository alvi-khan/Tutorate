import React from 'react';
import ReactDom from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import App from './App';
import { StateContextProvider } from './contexts/StateContextProvider';
import './global.css';
import { ChatContextProvider } from './contexts/ChatContextProvider';

ReactDom.render(
  <StateContextProvider>
    <ChatContextProvider>
      <Router>
        <App />
      </Router>
    </ChatContextProvider>
  </StateContextProvider>,
  document.getElementById('root'),
);

