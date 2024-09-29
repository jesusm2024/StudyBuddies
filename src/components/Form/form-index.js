import './form-styles.css';
import { useEffect, useState } from 'react';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import logo from '../../assets/pics/logo.png';
import { setData } from "../../utilities/firebase";


const Form = (props) => {

    // Google account information. 
    const auth = getAuth();
    const user = auth.currentUser;
    // Unique key to store new user information. 
    const uid = user.uid;
 
    // Refers to object representing currently logged in user
    const [activeUser] = useState(props.raw_users[uid]);

    const [pageLoaded, setPageLoaded] = useState(false);

    // Store components. 
    let name = false;
    let pronouns = false;
    let number = false;
    let email = false;
    let major = false;
    let year = false;
    let location = false;
    let preference = false;
    let matched = false;
    let schedule = {};
    
    // Days and hours for schedule.
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'];
    const [available, setAvailable] = useState([]);
    const short_days = ['Mo', "Tu", "We", "Th", "Fr", "Sa", "Su"];

    // Initialize all schedule values to false. 
    days.forEach((weekday) => {
        schedule[weekday] = {};
        hours.forEach((hour) => {
            schedule[weekday][hour] = false;
        });
    });


    // Send new user to database.
    const db = getDatabase();
    const sendToDatabase = () => {
        // key in database is user_id
        const userRef = ref(db, 'users/' + uid);
        set(userRef, {
            Name: name,
            Pronouns: pronouns,
            Number: number,
            Email: email,
            Major: major,
            Year: year,
            Location: location,
            Preference: preference,
            Schedule: schedule,
            Matched: matched
        });
    };

    // Function to validate email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Function to validate phone number
    function validatePhone(phone) {
        const re = /^\d{10}$/;
        return re.test(phone);
    }

    // Assign element to variable. 
    function getinputs() {
        name = document.getElementById("Name").value;
        pronouns = document.getElementById("Pronouns").value;
        number = document.getElementById("Number").value;
        email = document.getElementById("Email").value;
        major = document.getElementById("Major").value;
        location = document.getElementById("Location").value;
        year = document.getElementById("Year").value;
        preference = document.getElementById("Preference").value;
        // Populating schedule object with selected days and times. 
        available.forEach((item) => {
            let day = item.day;
            let hour = item.hour;
            schedule[day][hour] = true;
        })

        // Only send object to database if all entries filled and at least one time has been selected.
        if (name.length > 0 && pronouns.length > 0 && number.length > 0 && email.length > 0 && major.length > 0 
            && available.length > 0 && location && year && preference) {
            if (!validateEmail(email)) {
                alert("Please enter a valid email.")
            } else if (!validatePhone(number)) {
                alert("Please enter a valid phone number.")
            } else {
                sendToDatabase();
                if (!activeUser.classes) {
                    activeUser.classes = [];
                }
                setData("users/" + uid + "/classes", activeUser.classes);
                // Redirect to suggestions after signup/
                window.location.pathname = "/class";
            }
        } else {
            alert("Please enter your name, number, email, traits, and select at least one available time.");
        }
    }

    const dayOfWeek = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        7: 'Sunday'
    };
    
    const hourOfDay = {
        1: '8am',
        2: '9am',
        3: '10am',
        4: '11am',
        5: '12pm',
        6: '1pm',
        7: '2pm',
        8: '3pm',
        9: '4pm',
        10: '5pm',
        11: '6pm',
        12: '7pm',
        13: '8pm',
        14: '9pm',
        15: '10pm'
    };
    
    const [lastTouched, setLastTouched] = useState(null);
    const [handled, setHandled] = useState(null);

    useEffect(() => {
        setHandled(new Set());
    }, []);

    const handleTouchStart = (e) => {
        const touchedEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (touchedEl.type === 'checkbox') {
          e.preventDefault();
        }
        setHandled(new Set());
      };      
    
    useEffect(() => {
        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        return () => {
          document.removeEventListener('touchstart', handleTouchStart);
        };
      }, []);

    const handleTouchMove = (e) => {
        const touchedEl = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
        if (touchedEl.type === 'checkbox') {
            if (touchedEl !== lastTouched) {
                setLastTouched(touchedEl);
    
                const day = dayOfWeek[touchedEl.parentNode.cellIndex];
                const hour = hourOfDay[touchedEl.parentNode.parentNode.rowIndex];
                const key = `${day}-${hour}`;
    
                if (handled) {
                    if (!handled.has(key)) {
                        setHandled(new Set(handled.add(key)));
                        handleCheckboxChange(day, hour);
                    }
                }
            }
        }
    };
    
    

    // Save selected day and time. 
    function handleCheckboxChange(day, hour) {
        const index = available.findIndex(item => item.day === day && item.hour === hour);
        if (index === -1) {
          setAvailable([...available, { day, hour }]);
        } else {
          setAvailable(available.filter(item => !(item.day === day && item.hour === hour)));
        }
      }
      
    function handleCheckboxDrag(day, hour) {
        if (isDragging) {
            handleCheckboxChange(day, hour);
        }
    }

    const [isDragging, setIsDragging] = useState(false);

    function handleMouseDown(day, hour) {
        setIsDragging(true);
        handleCheckboxChange(day, hour);
    }
      
    function handleMouseUp() {
        setIsDragging(false);
    }

    document.addEventListener("mouseup", function(event) {
        if (isDragging) {
            setIsDragging(false);
        }
    });

    const SuggestionsReturn = () => {
        window.location.pathname = "/suggestions";
    }

    useEffect(() => {
            const newAvailable = [];
            
            if (activeUser) {
                for (const day in activeUser.Schedule) {
                    for (const hour in activeUser.Schedule[day]) {
                        if (activeUser.Schedule[day][hour]) {
                            newAvailable.push({ day, hour });
                        }
                    }
                }
            }

            setAvailable(newAvailable);
        
            // Update pageLoaded state variable after component mounts
            setPageLoaded(true);
    }, []);


    return (
        <div className='userSetupFormUpdate'>
            <div className='setupHeader'>
                {activeUser !== undefined ? <h2>Update your profile</h2> :  <h2>Let's get you set up</h2>}
                <img className='logoImg' src={logo} alt="Study Buddies logo"></img>
            </div>
            <form className='userSetup' action="#">
                <h3>Enter your name</h3>
                {
                    activeUser !== undefined ? 
                    <input type="text" id="Name" placeholder="Name" defaultValue={activeUser.Name ? activeUser.Name: ""}></input> :
                    <input type="text" id="Name" placeholder="Name" defaultValue={user.displayName ? user.displayName: ""}></input>
                }
                <h3>Enter your pronouns</h3>
                    <input type="text" id="Pronouns" placeholder="Pronouns" defaultValue={activeUser !== undefined && activeUser.Pronouns ? activeUser.Pronouns : ""}></input>
                <h3>Enter your phone number</h3>
                {
                    activeUser !== undefined ? 
                    <input type="number" id="Number" placeholder="Phone number" defaultValue={activeUser.Number ? activeUser.Number: ""}></input> :
                    <input type="number" id="Number" placeholder="Phone number" defaultValue={user.phoneNumber ? user.phoneNumber: ""}></input>    
                }
                <h3>Enter your email</h3>
                {
                    activeUser !== undefined ?
                    <input type="text" id="Email" placeholder="Email" defaultValue={activeUser.Email ? activeUser.Email: ""}></input> :
                    <input type="text" id="Email" placeholder="Email" defaultValue={user.email ? user.email: ""}></input>
                }
                <h3>What are you studying in school?</h3>
                <input type="text" id="Major" placeholder="Major" defaultValue={activeUser !== undefined && activeUser.Major ? activeUser.Major : ""}></input>

                <h3>What year are you in school?</h3>
                <div className="yearDropdown">
                    <select id="Year" defaultValue={activeUser !== undefined && activeUser.Year ? activeUser.Year : "Select"}>
                        <option value="Select" disabled> Select option </option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Grad Student">Grad Student</option>
                    </select>
                </div>
                <h3>Where do you live?</h3>
                <div className="locationDropdown">
                    <select id="Location" defaultValue={activeUser !== undefined && activeUser.Location ? activeUser.Location : "Select"}>
                        <option value="Select" disabled> Select Option </option>
                        <option value="North Campus">North Campus</option>
                        <option value="South Campus">South Campus</option>
                        <option value="Off Campus">Off Campus</option>
                    </select>
                </div>
                <div className='sleepDropdown'>
                    <h3>Tell us about your sleep habits</h3>               
                    <select id="Preference" defaultValue={activeUser !== undefined && activeUser.Preference ? activeUser.Preference : "Select"}>
                        <option value="Select" disabled> Select Option </option>
                        <option value="Early Bird">Early Bird</option>
                        <option value="Night Owl">Night Owl</option>
                    </select>
                </div>
                
            </form>
            <h3 className="availabilityTitle">Enter your availability</h3>
            <div className='scheduleDesc'>
                <p>Select the times that you are able and willing to study with a potential Study Buddy. This schedule will be used to match you with other Study Buddies. </p>
            </div>
            <div className='scheduleContainer'>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            {short_days.map(short_days => <th key={short_days}>{short_days}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                    {hours.map(hour => (
                        <tr key={hour} className="scheduleTimes">
                        <td>{hour}</td>
                        {days.map(day => (
                            <td key={`${hour}-${day}`}>
                            <input
                                type="checkbox"
                                checked={pageLoaded ? available.some(item => item.day === day && item.hour === hour) : (activeUser?.Schedule?.[day]?.[hour] || false)}
                                onMouseDown={() => handleMouseDown(day, hour)}
                                onMouseUp={() => handleMouseUp()}
                                onMouseOver={() => handleCheckboxDrag(day, hour)}
                                onTouchStart={(e) => handleTouchStart(e)}
                                onTouchMove={(e) => handleTouchMove(e)}
                            />
                            </td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {
                activeUser !== undefined ?
                <div className='updateButtonContainer'>
                    <button type="button" className='cancelButton' onClick={SuggestionsReturn}>
                    Cancel
                    </button>
                    <button type="button" className='updateButton' onClick={getinputs}>
                    Update
                    </button>
                </div> :
                <button className='submitButton' type="button" onClick={getinputs}>Submit</button>
            }
        </div>
    )
}

export default Form;