// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyDHwLTQ-E7NAh_AFwgLEOb_vmk2wwqYhmI',
	authDomain: 'pickle-stats.firebaseapp.com',
	projectId: 'pickle-stats',
	storageBucket: 'pickle-stats.appspot.com',
	messagingSenderId: '669279375370',
	appId: '1:669279375370:web:41a0fc3dc717de293fcff3',
	measurementId: 'G-FSNZ57NFRW'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
