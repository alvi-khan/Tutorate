import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    const [user, setUser] = useState(storedUser ?? {});
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useState({});
    const defaultParams = {
        subjects: [],
        grades: [],
        wages: [0, 10000],
        rank: 0,
    }

    return (
        <StateContext.Provider value={{
            user, setUser,
            searchTerm, setSearchTerm,
            searchParams, setSearchParams,
            defaultParams
        }}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
