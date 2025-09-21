import { auth } from "@/firebaseConfig"
import { User } from "@/types/user"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"


export async function registerUser(user: User) {
  console.log("Registering user:", user)
  const response = await createUserWithEmailAndPassword(auth,user.email, user.password)
  console.log("User Success full :", response.user)
  return response.user

}

export const login = async (email: string, password: string) => {
  console.log("Logging in with......................:", email)
  const response = await signInWithEmailAndPassword(auth, email, password)
  console.log("Login Success full :", response.user)
  return response
}

export const logout = () => {
  return signOut(auth)
}


export const getCurrentUser = () => {
  const email = auth.currentUser?.email;
  console.log("Current user email:", email);
  return email ? email : null;
}
