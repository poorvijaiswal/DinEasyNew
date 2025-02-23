// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAH6ndiUEgjn6lzqsVCmNT5I8bp5DAtJk8",
  authDomain: "dineasy-f340d.firebaseapp.com",
  projectId: "dineasy-f340d",
  storageBucket: "dineasy-f340d.firebasestorage.app",
  messagingSenderId: "1034616382435",
  appId: "1:1034616382435:web:29d27058cc685bbb8f36d6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };