import React from 'react';

import { Navbar } from './components/Navbar';
import { Routes } from './components/Routes';

const App = () => (
  <div>
    <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-200 black min-h-screen">
      <Navbar />
      <Routes />
    </div>
  </div>
);

export default App;
