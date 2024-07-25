import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbxNvRQGtx2uAnJMfkMsvlvR3Fp0Rqr6Q",
  authDomain: "test01-f2ca5.firebaseapp.com",
  projectId: "test01-f2ca5",
  storageBucket: "test01-f2ca5.appspot.com",
  messagingSenderId: "221387206049",
  appId: "1:221387206049:web:fedbfd3ea0f0c72e51afe0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth();
export const db=getFirestore(app);
export default app;