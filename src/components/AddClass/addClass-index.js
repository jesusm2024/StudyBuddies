import './addClass-styles.css';
import logo from '../../assets/pics/logo.png';
import { getAuth } from "firebase/auth";
import { useState } from 'react';
import { setData } from "../../utilities/firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

const AddClass = (props) => {
    // Google account information.
    const auth = getAuth();
    const user = auth.currentUser;
    // Unique key to store new user information.
    const uid = user.uid;

    // refers to object representing currently logged in user
    const [activeUser] = useState(props.raw_users[uid]);
    const [classes] = useState(props.raw_classes);

    if (!activeUser.classes) {
        activeUser.classes = [];
    }

    // Send class to database.
    const AddNewClass = () => {
        const classCode = document.getElementById("newClassInput").value;
        if (!(classCode in classes))
        {
            alert("Class not found, please enter a valid class code.")
            return;
        }

        if (!activeUser.classes) {
            activeUser.classes = [];
        }
        activeUser.classes.push(classCode);

        setData("users/" + uid + "/classes", activeUser.classes);
    }

    // Send user to the suggestions page.
    const GoToSuggestions = () => {
        window.location.pathname = "/suggestions";
    }

    return (
        <div className='mainContainer'>
            <div className='setupHeader'>
                <h1>Classes</h1>  
                <img className='logoImg' src={logo} alt="Study Buddies logo"></img>
            </div>
            <div className="courseContainer">
                <div className="courseInputContainer">
                    <h2>Let's get you enrolled in a course</h2>
                    <form className='inputContainer'>
                        <input id="newClassInput" type="text" placeholder="Course code"/>
                        <button onClick={AddNewClass}>Enroll</button>
                    </form>
                </div>
                <div className="displayCurrentCourses">
                    <h2>My Courses</h2>
                    <div className = "currentCoursesContainer">
                        {activeUser.classes.map((code, i) => {
                            
                            return (
                                <div key={i} className='courseElement' onClick={GoToSuggestions}>
                                    <p>{classes[code].name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default AddClass;