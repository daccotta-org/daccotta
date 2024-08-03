import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { SignUpFormData } from "../Types/validationSchema";
import { auth } from "../pages/auth/firebase";

export const createUser = async (data: SignUpFormData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const idTokenResult = await userCredential.user.getIdTokenResult();
const idToken = idTokenResult.token;
console.log("Generated token:", idToken.substring(0, 10) + "...");
    console.log("header authariation ")
    console.log(`Bearer ${idToken}`)

    const response = await axios.post('http://localhost:8080/api/users', {
      uid: userCredential.user.uid,
      email: data.email,
      userName: data.userName,
      age: data.age,
    }, {
      headers: {
        'Authorization': `Bearer ${idToken}`,
      },
      
    });
    return response;
    
}
    

