import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArKP8DkAUqhBl0gUcyMO4P7q3kU34MmYM",
  authDomain: "daccotta-fd25e.firebaseapp.com",
  projectId: "daccotta-fd25e",
  storageBucket: "daccotta-fd25e.appspot.com",
  messagingSenderId: "908673811941",
  appId: "1:908673811941:web:b40b6864d777d596a25b0c"
};
// Initialize Firebase`
const app = initializeApp(firebaseConfig);
export const auth=getAuth();

export default app;