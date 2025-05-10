import { useState } from 'react';
import { Button, Form, Row, Col, Alert } from 'react-bootstrap';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

/**
 * Allows the user to login to the system.
 * 
 * @returns {JSX.Element} - Form to login with a username and password input.
 */
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useUserContext();

    const navigate = useNavigate();

    /**
     * Handles the key down event on the username and password
     * input boxes. If the enter key is pressed, handleLogin
     * is called.
     * 
     * @param {Event} e - The key down event.
     */
    function handleKeyDown(e) {
        if (e.key === 'Enter')
            handleLogin();
    }

    /**
     * Validates the username and password and calls the API endpoint
     * to login the user. If successful, the user is redirected to
     * the recipes page.
     */
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