import React from 'react';
import Navigation from './components/Navigation';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './components/AppRoutes';

/**
 * Renders the recipe manager frontend.
 * 
 * @returns {JSX.Element} - The app component.
 */
export default function App() {

    return <UserProvider>
        <Router>
            <Navigation />
            <AppRoutes />
        </Router>
    </UserProvider>;
}