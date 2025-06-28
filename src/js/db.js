import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

//add a new task for current user
export async function addTask(text, checked = false) {
  const user = auth.currentUser;
  if (!user) return;
  await addDoc(collection(db, "users", user.uid, "tasks"), {
    text,
    checked,
    timestamp: newDate().toIsoString(),
  });
}

//load tasks from firestore db

export async function loadTask() {
  const user = auth.currentUser;
  if (!user) return;
  const snapshot = await getDocs(collection(db, "user", user.uid, "tasks"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
