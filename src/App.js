import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDbData } from './utilities/firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOut } from "@firebase/auth";
import LoginScreen from './screens/LoginScreen/login-screen-index';
import AccountScreen from './screens/AccountScreen/account-screen-index';
import SuggestionScreen from './screens/SuggestionScreen/suggestion-screen-index';
import ClassScreen from './screens/ClassScreen/class-screen-index';
import AddClass from "./components/AddClass/addClass-index";



export default function App() {

  const auth = getAuth();
  console.log("auth: " + auth);
  const userInfo = auth.currentUser;
  console.log("userInfo: " + userInfo);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log("onState change: " + user.email)
    } else {
      // User is signed out
      // ...
    }
  });

  const [users, error] = useDbData('/users');
  const [classes, class_error] = useDbData('/classes');
  const [isAuth, setIsAuth] = useState(0);


  // const signUserOut = (setIsAuth) => {
  //     signOut(auth).then(() => {
  //         localStorage.clear();
  //         setIsAuth(false);
  //         window.location.pathname = "/";
  //     })
  // }
  
  
  if (error) return <h1>{error}</h1>;

  // while waiting for data from firebase
  if (!users || !classes) return <h1>Loading</h1>;

  console.log(users);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen setIsAuth={setIsAuth} />} />
        <Route path="/input" element={<AccountScreen raw_users={users ? users : "Loading"} />} />
        <Route path="/class" element={<AddClass raw_users={users} raw_classes={classes} /> } />
        <Route path="/suggestions" element={<SuggestionScreen raw_users={users} userInfo={userInfo}/>}></Route>
      </Routes>
    </BrowserRouter>
  );

  
}