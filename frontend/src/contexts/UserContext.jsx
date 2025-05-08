import React, { createContext, useState, useContext } from 'react';
import { loginUser, registerUser } from '../services/auth';

export const UserContext = createContext();

export function useUserContext() {
    return useContext(UserContext);
}

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loggedIn, setLoggedIn] = useState(user || localStorage.getItem("token"));
    
    // useEffect(() => {
    //     if (token) {
    //         // fetch user and call setUser()
    //     }
    // });

    async function login(username, password) {
        const data = await loginUser(username, password);
        if (data.error) {
            return data.error;
        }

        // add the JWT to local storage so user stays logged in
        localStorage.setItem('token', data);
        setUser(username);
        setToken(data);
        setLoggedIn(true);
    }

    async function signup(username, password) {
        const data = await registerUser(username, password);
        if (data.error) {
            return data.error;
        }

        // if registered successfully, log the user in
        return await login(username, password);
    }

    async function logout() {
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
        setLoggedIn(false);
    }

    const value = {
        user,
        token,
        login,
        signup,
        logout,
        loggedIn
    };

    return <UserContext.Provider value={value}>
        { children }
    </UserContext.Provider>;
}