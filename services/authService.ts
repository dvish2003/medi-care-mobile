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

// export const login = (email: string, password: string) => {
//   return signInWithEmailAndPassword(auth, email, password)
// }

// export const logout = () => {
//   return signOut(auth)
// }
