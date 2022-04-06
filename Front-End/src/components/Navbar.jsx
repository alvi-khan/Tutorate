import React from 'react';
import { Link } from 'react-router-dom';

import { Search } from './searchBar/Search';
import { ProfileBar } from './ProfileBar';

export const Navbar = () => (
  <div className="p-5 pb-0 flex flex-wrap sm:justify-between justify-center items-center border-b dark:border-gray-700 border-gray-200 ">
    <div className="flex justify-between items-center space-x-5 w-screen ">
      <Link to="/">
        <p className="text-2xl bg-blue-200 font-bold text-gray-700 py-1 px-2 rounded dark:bg-gray-50 dark:text-gray-900">
          Tutorate 🎓
        </p>
      </Link>
    </div>
    <Search />
      <div className="profileDiv">
          <ProfileBar />
      </div>
  </div>
);
