import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// https://firebase.google.com/docs/web/setup#available-libraries
// Add to gitignore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqNYqZwOvKb9I-EjGZqb7FeQGZkz0jMkg",
  authDomain: "enunciatedb.firebaseapp.com",
  projectId: "enunciatedb",
  storageBucket: "enunciatedb.appspot.com",
  messagingSenderId: "701143628186",
  appId: "1:701143628186:web:145e0ee2d1bdcf63506223"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);