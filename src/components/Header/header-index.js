import React from 'react';
import './header-styles.css';
import profile from '../../assets/pics/Profile.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { auth } from "../../utilities/firebase";
import { signOut } from "@firebase/auth";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import logo from '../../assets/pics/logo.png';

const Header = (props) => {

    const user = props.userInfo;

    const UpdateForm = () => {
        window.location.pathname = "/input";
    }

    const ViewClasses = () => {
        window.location.pathname = "/class";
    }
    
    return (<div className='appHeader'>
        <div className='currentClass' onClick={ViewClasses}>
            <img className='logoImg' src={logo} alt='match'></img>
            <h1>Study Buddies</h1>
        </div>
        <div className='nav'>
            {/*{!getAuth ? (<Link to="/"> Login </Link>) : (<Link to="/input"> Logout </Link>)*/}
            {/*}*/}
            <img  src={user!== null ? user.photoURL : profile} alt="myProfilePic" className='myProfilePic' onClick={UpdateForm}></img>
            {/*<FontAwesomeIcon icon={faGear} size='3x'/>*/}
        </div>
    </div>);
}

export default Header;