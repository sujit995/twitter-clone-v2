// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBcWU_qrY8Ehje-mCTiTrJQ3ykoWZgxW_Y",
    authDomain: "twitter-clone-3a534.firebaseapp.com",
    projectId: "twitter-clone-3a534",
    storageBucket: "twitter-clone-3a534.appspot.com",
    messagingSenderId: "158754026585",
    appId: "1:158754026585:web:494782109f4bfe3ba8ed48"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();
export { app, db, storage };