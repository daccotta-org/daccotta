import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { firebaseConfig2 } from "./firebaseConfig"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// Initialize Firebase`
const app = initializeApp(firebaseConfig2)
export const auth = getAuth()

export default app
