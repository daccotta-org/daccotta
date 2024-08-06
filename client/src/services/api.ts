import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { SignUpFormData } from "../Types/validationSchema";
import { auth } from "../pages/auth/firebase";

export const createUser = async (data: SignUpFormData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
  const idTokenResult = await userCredential.user.getIdTokenResult();
  const idToken = idTokenResult.token;

  const response = await axios.post('http://localhost:8080/api/users', {
    uid: userCredential.user.uid,
    email: data.email,
    age: data.age,
    onboarded: false, // Add this line
  }, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
    },
  });

  // Redirect to onboarding page
  window.location.href = '/onboard';

  return response;
}
    

