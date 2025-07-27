import { db, auth } from "./firebase.js";
import {
  collection,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";

//save a new task for current user
export async function addTask(tasktext, deadlineValue = null) {
  const user = auth.currentUser;
  if (!user) return;

  await addDoc(collection(db, "users", user.uid, "tasks"), {
    text: tasktext,
    checked: false,
    timestamp: serverTimestamp(),
    sortTimestamp: serverTimestamp(),
    ...(deadlineValue && { deadline: deadlineValue }), // ✅ save as 'deadline'
  });
}

//save email to firestore db

export async function saveEmail() {
  const user = auth.currentUser;
  if (!user) return;
  const email = user.email;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  //snap like  screenshot to check if data contains email or not or data at all
  if (!snap.exists() || !snap.data().email) {
    await setDoc(userRef, { email }, { merge: true });
  }
  //merge keeps other fields save
}

//load tasks from firestore db

export async function loadTask() {
  const user = auth.currentUser;
  if (!user) return;

  const tasksRef = collection(db, "users", user.uid, "tasks");
  const q = query(tasksRef, orderBy("timestamp", "asc")); // ✅ sort oldest first
  const snapshot = await getDocs(q);

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

//reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent. Check your inbox.");
  } catch (error) {
    alert("Error: " + error.message);
  }
}
