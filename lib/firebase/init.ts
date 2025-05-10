// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: "AIzaSyAZNXM_h_OXvDQ2TsVx9j0JBCm2d9L9gNY",
 authDomain: "coffee-bd7e8.firebaseapp.com",
 projectId: "coffee-bd7e8",
 storageBucket: "coffee-bd7e8.firebasestorage.app",
 messagingSenderId: "187930213815",
 appId: "1:187930213815:web:7597961b0d4e12b8c7fc32",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, app};
