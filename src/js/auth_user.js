import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

//login.js
export function login(email, password) {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, email, password);
}

// createUser.js

export function createUser(email, password, name) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      const user = userCredential.user;
      // Update the user's profile with the name
      return updateProfile(user, {
        displayName: name,
      }).then(() => {
        return userCredential; // Return the user object after updating the profile
      });
    }
  );
}

//check logged in status

export function listenToAuthState(callback) {
  const auth = getAuth();
  onAuthStateChanged(auth, callback);
}

//logout function

export function logout() {
  const auth = getAuth();
  return signOut(auth);
}
