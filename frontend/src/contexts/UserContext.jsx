import React, { createContext, useState, useContext } from 'react';
import { loginUser, registerUser } from '../services/auth';

export const UserContext = createContext();

/**
 * Custom hook to access the UserContext.
 * 
 * @returns {Object} - The user context value.
 */
export function useUserContext() {
    return useContext(UserContext);
}

/**
 * Manages the user details, providing context for the user, token, authentication
 * related functions and logged in status.
 * 
 * @param {Object} children - The child components that consume the context. 
 * @returns {JSX.Element} - The UserContext provider component.
 */
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loggedIn, setLoggedIn] = useState(user || localStorage.getItem("token"));

    /**
     * Logs the user in by calling the login API endpoint. If successful,
     * stores the JWT token in local storage and sets the context values.
     * 
     * @param {String} username - The username to be logged in with.
     * @param {String} password - The password to be logged in with.
     * @returns {String} - Optional error.
     */
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

    /**
     * Signs up the user by calling the register API endpoint. If
     * successful, logs the user in.
     * 
     * @param {String} username - The username to sign up with. 
     * @param {String} password - The password to sign up with.
     * @returns {String} - Optional error.
     */
    async function signup(username, password) {
        const data = await registerUser(username, password);
        if (data.error) {
            return data.error;
        }

        return await login(username, password);
    }

    /**
     * Logs the currently logged in user out by removing the JWT token
     * from local storage and then updates the relevant context values.
     */
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