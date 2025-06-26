import {
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  createUserWithEmailAndPassword,
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
