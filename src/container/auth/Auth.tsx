import React, { useState, useEffect } from 'react';
import Input from '../../components/ui/input/Input';
import Button from '../../components/ui/button/Button';
import { authUI, showAuthUI } from '../../firebase/firebase';
import firebase from 'firebase';

export default function() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => showAuthUI('#firebase-auth-container'), [])

    return (
        <div>
            <div id="firebase-auth-container"></div>
            <button onClick={() => firebase.auth().signOut()}>Sign out</button>
            {/* <Input label='username' elementType='input' elementConfig={{type: 'text'}} value={username} onChange={(event) => setUsername(event.target.value)} />
            <Input label='password' elementType='input' elementConfig={{type: 'password'}} value={password} onChange={event => setPassword(event.target.value)} />
            <Button elementConfig={{onClick: signinHandler}} label='Sign In' />
            <Button elementConfig={{onClick: signupHandler}} label='Sign Up' /> */}
        </div>
    );
}