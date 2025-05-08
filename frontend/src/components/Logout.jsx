import React, { useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const { logout } = useUserContext();

    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login');
    }, [logout, navigate]);

    return <h4 className='text-center align-items-center mt-5'>Logging you out...</h4>;
}