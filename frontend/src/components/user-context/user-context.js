import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserIDGetter = ({ children }) => {
    const [userId, setUserId] = useState(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};