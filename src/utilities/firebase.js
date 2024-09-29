// Import the functions you need from the SDKs you need
import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "@firebase/auth";
import { getDatabase, onValue, ref, set, connectDatabaseEmulator } from "firebase/database";


const firebaseConfig = {
  apiKey: "AIzaSyDRUi80E04h5T6y036ToKx5nyKi3agfJnw",
  authDomain: "studybuddy-946ae.firebaseapp.com",
  databaseURL: "https://studybuddy-946ae-default-rtdb.firebaseio.com",
  projectId: "studybuddy-946ae",
  storageBucket: "studybuddy-946ae.appspot.com",
  messagingSenderId: "190364816578",
  appId: "1:190364816578:web:0fca237ce12491a7d5975b"
};


// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const auth = getAuth(firebase);
export const provider = new GoogleAuthProvider();

// if (process.env.NODE_ENV !== 'production') {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectDatabaseEmulator(database, "127.0.0.1", 9000);
// }

// if (!windows.EMULATION && import.meta.env.NODE_ENV !== 'production') {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectDatabaseEmulator(database, "127.0.0.1", 9000);

//   signInWithCredential(auth, GoogleAuthProvider.credential(
//     '{"sub": "qEvli4msW0eDz5mSVO6j3W7i8w1k", "email": "tester@gmail.com", "displayName":"Test User", "email_verified": true}'
//   ));
  
//   // set flag to avoid connecting twice, e.g., because of an editor hot-reload
//   windows.EMULATION = true;
// }

export const setData = (path, value) => (
  set(ref(database, path), value)
);

export const useDbData = (path) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(
    () =>
      onValue(
        ref(database, path),
        (snapshot) => {
          setData(snapshot.val());
        },
        (error) => {
          setError(error);
        }
      ),
    [path]
  );

  return [data, error];
};
