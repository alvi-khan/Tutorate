import React, { useEffect, useState } from 'react';
import {useDebouncedCallback} from 'use-debounce';

import { useStateContext } from '../../contexts/StateContextProvider';
import { AdvancedSearch } from './AdvancedSearch';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Search = () => {
  const { searchTerm, setSearchTerm } = useStateContext();
  const [text, setText] = useState('');
  const [advancedSearchShown, setAdvancedSearchShown] = useState(false);
  const debounced = useDebouncedCallback((text) => setSearchTerm(text), 300);

  function updateText(text) {
      debounced(text);
      setText(text);
  }

  useEffect(() => setText(searchTerm), [searchTerm]);

  return (
    <div className="relative ">
      <input
        value={text}
        type="text"
        className="sm:w-96 w-80 h-10 dark:bg-gray-200  border rounded-full shadow-sm outline-none p-6 text-black hover:shadow-lg"
        style={{width: 450}}
        placeholder="🔎 Search by Name or Location"
        onChange={(e) => updateText(e.target.value)}
      />
      {text !== '' && (
        <button type="button" className="absolute top-3 right-16" onClick={() => updateText('')}>
          ❌
        </button>
      )}
      <button type="button" onClick={() => {setAdvancedSearchShown(true)}}>
        <i className="ml-5 fs-4 bi bi-sliders2" />
      </button>
      <AdvancedSearch show={advancedSearchShown} onHide={() => setAdvancedSearchShown(false)}/>
    </div>
  );
};
