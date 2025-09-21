// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHIJkfIauYmYaTlQktETuyd7dErWlwVmE",
  authDomain: "medi-care-baa95.firebaseapp.com",
  projectId: "medi-care-baa95",
  storageBucket: "medi-care-baa95.firebasestorage.app",
  messagingSenderId: "517520971040",
  appId: "1:517520971040:web:21fb2bb373e51cfad13345"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);
 export { auth, db };

