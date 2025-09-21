import { Reminder } from '../types/reminder';
import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig"; 
import { getDocs,deleteDoc,updateDoc } from "firebase/firestore";


interface saveReminder {
      title: string,
      note: string,
      date: string,
      time: string,
      email?: string
}

export const saveReminder = async (reminder: Reminder) => {
    console.log("Saving reminder..........:", reminder);
    const { title, note, date, time, email } = reminder;
    const reminderData: saveReminder = { title, note, date, time };
    if (email) {
        reminderData.email = email;
    }
    try {
        const docRef = await addDoc(collection(db, "reminders"), reminderData);
        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const remindersSnapshot = await getDocs(collection(db, "reminders")); // use "reminders" not "reminder"
    console.log("Fetched reminders:", remindersSnapshot.docs);
    return remindersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Reminder[];
  } catch (e) {
    console.error("Error fetching reminders: ", e);
    throw e;
  }
};

export const updateRem = async (id: string, updatedData: Partial<Reminder>) => {
    try {
        const docRef = doc(db, "reminders", id);
        await updateDoc(docRef, updatedData);
        console.log("Reminder updated!");
    } catch (error) {
        console.error("Error updating reminder:", error);
    }
}

export const deleteRem = async (id: string) => {
  try {
    const docRef = doc(db, "reminders", id);
    await deleteDoc(docRef);
    console.log("Reminder deleted!");
  } catch (error) {
    console.error("Error deleting reminder:", error);
  }
};
