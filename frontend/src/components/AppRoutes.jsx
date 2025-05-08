import { Routes, Route, Navigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import Login from './Login';
import Signup from './Signup';
import Recipes from './Recipes';
import Cupboard from './Cupboard';

export default function AppRoutes() {
    const { loggedIn } = useUserContext();

    return <Routes>
        <Route path="/" element={ loggedIn ? <Navigate to="/recipes" /> : <Navigate to="/login" /> } />
        <Route path="/login" element={ loggedIn ? <Navigate to="/recipes" /> : <Login /> } />
        <Route path="/signup" element={ loggedIn ? <Navigate to="/recipes" /> : <Signup /> } />
        <Route path="/recipes" element={ loggedIn ? <Recipes /> : <Navigate to="/login" /> } />
        <Route path="/cupboard" element={ loggedIn ? <Cupboard /> : <Navigate to="/login" /> } />
    </Routes>;
}