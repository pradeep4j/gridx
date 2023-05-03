import React, { createContext, useState } from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    loginUser: () => { },
    logoutUser: () => { },
});

export const AuthContextProvider = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    const loginHandler = () => {
        setUserLoggedIn(true);
    };

    const logoutHandler = () => {
        setUserLoggedIn(false);
    };

    const authContextValue = {
        isLoggedIn: userLoggedIn,
        loginUser: loginHandler,
        logoutUser: logoutHandler,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
