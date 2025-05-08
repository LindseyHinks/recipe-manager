import React, { useState } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useUserContext();

    const navigate = useNavigate();

    function handleKeyDown(e) {
        if (e.key === 'Enter')
            handleLogin();
    }

    async function handleLogin() {
        if (username.trim() === "") {
            setError("Please enter your username");
            return;
        }
        if (password.trim() === "") {
            setError("Please enter your password");
            return;
        }
        
        try {
            const err = await login(username, password);
            if (err) {
                setError(err);
                return;
            }

            navigate('/recipes');
        } catch (err) {
            // probably some internal server/network/JSON decoding error
            setError("Unexpected error, please try again later");
        }
    }

    return <div className='d-flex justify-content-center align-items-center vh-100'>
        <Form className='m-3 p-3 shadow w-fit-content'>
            <Form.Group className='mb-2'>
                <Row>
                    <Col sm="auto">
                        <Form.Label className='mt-1'>Username:</Form.Label>
                    </Col>
                    <Col sm="auto">
                        <Form.Control type="text" onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown} />
                    </Col>
                </Row>
            </Form.Group>
            <Form.Group className='mb-4'>
                <Row>
                    <Col sm="auto" className='me-1'>
                        <Form.Label className='mt-1'>Password:</Form.Label>
                    </Col>
                    <Col sm="auto">
                        <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} />
                    </Col>
                </Row>
            </Form.Group>
            <Button variant="dark" onClick={handleLogin} className='m-auto d-flex'>Login</Button>
            <p className='text-center mt-2'>Don't have an account? <a href='/signup'>Sign up here</a></p>
            {error && <Alert variant="danger" className='mt-3 w-fit-content m-auto'>{error}</Alert>}
        </Form>
    </div>;
}