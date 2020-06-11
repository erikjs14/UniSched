import firebaseConfig from './firebaseConfig.json';
import firebase from 'firebase/app';
import {auth} from 'firebaseui';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export const authUI: auth.AuthUI = new auth.AuthUI(firebase.auth());

export const showAuthUI = (identifier: string | Element): void => {
    authUI.start(identifier, {
        signInSuccessUrl: '/todo',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        tosUrl: '/tos',
        privacyPolicyUrl: '/privacy',
    });
}

export const signOut = () => {
    firebase.auth().signOut();
}