import { initializeApp } from 'firebase/app';
import { getStorage, ref } from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAkvKruV6IPDJshzq_NnU-Z3BZlQwX-KWM",
    authDomain: "onaution-dc7b6.firebaseapp.com",
    projectId: "onaution-dc7b6",
    storageBucket: "onaution-dc7b6.appspot.com",
    messagingSenderId: "1016579671424",
    appId: "1:1016579671424:web:e0fc4d40b224703078ad65",
    measurementId: "G-GKP8T1N7KW"
};

initializeApp(firebaseConfig);

const storage = getStorage();


export { storage as default };
