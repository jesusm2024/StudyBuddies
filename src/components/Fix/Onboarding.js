import React, { useState } from 'react';
import './styles.css';

function Onboarding() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [courseName, setCourseName] = useState("");
    const [studyTime, setStudyTime] = useState("morning");

    const onStudyTimeChange = e => {
        console.log(e.target.value);
        setStudyTime(e.target.value);
    }

    return (
        <div className='userSetupForm'>
            <h2>Let's get you set up.</h2>
            <form className='userSetup' action="#">
                <h3>Enter your name</h3>
                <label for="fname">Enter your first name</label>
                <input type="text" id="fname" name="fname" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name"/><br/>
                <label for="lname">Enter your last name</label>
                <input type="text" id="lname" name="lname" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name"/><br/>

                <h3>Enter your email</h3>
                <label for="email">Enter your email</label>
                <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/><br/>

                <h3>What course would you like to find study buddies in?</h3>
                <label for="course">What course would you like to find study buddies in?</label>
                <input type="text" id="course" name="course" value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="Course name"/><br/>

                <h3>When would you prefer to study?</h3>
                <div onChange={onStudyTimeChange}>
                <input type="radio" id="morning" name="times" value="morning" checked={studyTime === 'morning'}/>
                <label for="morning">Morning</label><br/>
                <input type="radio" id="afternoon" name="times" value="afternoon" checked={studyTime === 'afternoon'}/>
                <label for="afternoon">Afternoon</label><br/>
                <input type="radio" id="night" name="times" value="night" checked={studyTime === 'night'}/>
                <label for="night">Night</label><br/>
                </div>

                <input type="submit" value="Submit"/>
            </form>
        </div>);
}

export default Onboarding;