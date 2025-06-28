import { db, auth } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

//save a new task for current user
export async function addTask(text, checked = false) {
  const user = auth.currentUser;
  if (!user) return;
  await addDoc(collection(db, "users", user.uid, "tasks"), {
    text,
    checked,
    timestamp: new Date().toISOString(),
  });
}

//load tasks from firestore db

export async function loadTask() {
  const user = auth.currentUser;
  if (!user) return;
  const snapshot = await getDocs(collection(db, "users", user.uid, "tasks"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

//delete tasks from firstore db

export async function deleteTask(taskID) {
  const user = auth.currentUser;
  if (!user) return;

  await deleteDoc(doc(db, "users", user.uid, "tasks", taskID));
}

//update task
export async function updateTask(taskID, data) {
  const user = auth.currentUser;
  if (!user) return;
  await updateDoc(doc(db, "users", user.uid, "tasks", taskID), data);
}

//Clear all tasks

export async function clearTasks() {
  const user = auth.currentUser;
  if (!user) return;
  const tasksCol = collection(db, "users", user.uid, "tasks");
  const snapshot = await getDocs(tasksCol);
  const deletePromises = [];
  snapshot.forEach((taskDoc) => {
    deletePromises.push(
      deleteDoc(doc(db, "users", user.uid, "tasks", taskDoc.id))
    );
  });
  await Promise.all(deletePromises);
}
