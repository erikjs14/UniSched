import firebaseConfig from './firebaseConfig.json';
import firebase from 'firebase/app';
import * as firebaseui from 'firebaseui';
import 'firebase/auth';

firebase.initializeApp(firebaseConfig);


export const authUI: firebaseui.auth.AuthUI = new firebaseui.auth.AuthUI(firebase.auth());

export const showAuthUI = (identifier: string | Element): void => {
    authUI.start(identifier, {
        signInSuccessUrl: '/todos',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        tosUrl: '/tos',
        privacyPolicyUrl: '/privacyPolicy',
    });
}