// import React from 'react';
import Login from '../../components/Login/login-index';
import { signInWithPopup, getAuth } from "@firebase/auth";
import { auth, provider } from '../../utilities/firebase';

const LoginScreen = (props) => {

    // Google account information. 
    const auth = getAuth();
    const user = auth.currentUser;


    const signInWithGoogle = () => {
        // Returning user redirected.
        if (user != null){
            if (window.confirm("Welcome back!\nWould you like to continue where you left off to view your potential matches? Otherwise select \"Cancel\" to update your information.")){ 
                window.location.pathname = "/class";
            }
            else {
                window.location.pathname = "/input";
            }
        }
        else {
            signInWithPopup(auth, provider).then((result) => {
                localStorage.setItem("isAuth", true);
                props.setIsAuth(true);
                window.location.pathname = "/input";
            });
        }
    };

    return (
        <div>
            <Login signInWithGoogle={signInWithGoogle}/>
        </div>
    )
}

export default LoginScreen;