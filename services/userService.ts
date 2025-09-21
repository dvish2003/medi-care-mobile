import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import {getDoc } from "firebase/firestore";
import { UserData } from '@/types/user';


interface saveUser {
  name: string;
  email: string;
  phone: string;
  age: string;
  address: string;
}

export const saveUser = async (userData: UserData) => {
    console.log("Saving user..........:", userData);
    const { id,name,email,phone,age,address } = userData

    const userData_1: saveUser = {name,email,phone,age,address };
    if (email) {
        userData.email = email;
    }
    try {
        const docRef = await addDoc(collection(db, "userDatas"), userData_1);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};


//get user data by id


export const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const docRef = doc(db, "userDatas", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        name: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        age: data?.age || "",
        address: data?.address || "",
      } as UserData;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching user data: ", e);
    throw e;
  }
};



