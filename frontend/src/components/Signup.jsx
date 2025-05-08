import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSignup(e) {
        console.log(e);
    }

    return <Form onSubmit={handleSignup} className='m-3 p-3 shadow w-50'>
        <Form.Group className='mb-2'>
            <Row>
                <Col sm="auto">
                    <Form.Label>Username:</Form.Label>
                </Col>
                <Col sm="auto">
                    <Form.Control type="text" />
                </Col>
            </Row>
        </Form.Group>
        <Form.Group className='mb-2'>
            <Row>
                <Col sm="auto">
                    <Form.Label>Password:</Form.Label>
                </Col>
                <Col sm="auto">
                    <Form.Control type="password" />
                </Col>
            </Row>
        </Form.Group>
        <Button variant="dark" type="submit">Signup</Button>
    </Form>;
}