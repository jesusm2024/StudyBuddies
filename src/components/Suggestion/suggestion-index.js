import './suggestion-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect, setPageLoaded, getElementById} from 'react';
import { getAuth } from "firebase/auth";
import { setData } from "../../utilities/firebase";


const Suggestion = (props) => {

  // returns overlap between two schedules
  const ScheduleOverlap = (user, other) => {
    const overlap = {}
    for (const [day, times] of Object.entries(user.Schedule)) {
      overlap[day] = {}
      for (const [time, is_available] of Object.entries(times)) {    
        overlap[day][time] = is_available && other.Schedule[day][time];
      }
    }
    return overlap;
  };

  // returns array of other users (not whoever is logged in)
  const FormatUsers = (user_id, raw_users) => {
    let other = [];
    for (const [id, user] of Object.entries(raw_users)) {
      if (id !== user_id) {
        // calculate overlap between active user and other
        const overlap_obj = ScheduleOverlap(raw_users[user_id], user);
        // count up number of overlaps for each day
        const counts = Object.values(overlap_obj).map(day => {
            return Object.values(day).filter(b => b).length;
        });
        // sum to get total overlaps
        user.num_overlaps = counts.reduce((acc, cur) => acc + cur, 0);
        user.uid = id;
        other.push(user);
      }
    }
    // filter out users who have already been matched
    other = other.filter((u) => !u.Matched);
    // sort in decending order by overlaps
    other.sort((a, b) => b.num_overlaps - a.num_overlaps);
    return other;
  };

  const auth = getAuth();
  const user = auth.currentUser;
  const user_id = user.uid;

  console.log('current user: ', user)
  console.log('user_id: ', user_id)
  console.log('raw users: ', props.raw_users)
  // refers to object representing currently logged in user
  const [activeUser] = useState(props.raw_users[user_id]);
  // index in list of possible suggestions
  const [index, setIndex] = useState(0);
  // list of possible suggestions (excludes logged in user)
  const [allUsers, setAllUsers] = useState(FormatUsers(user_id, props.raw_users));
  
  const nextUser = () => {
    setIndex((index + 1) % allUsers.length);
  };

  const matched = () => {
    // const modal = document.getElementById('popUp');
    // const btn = document.getElementById('interestedButton');
    // const span = document.getElementsByClassName('close')[0];
  
    // btn.onclick = () => {
    //   modal.style.display = 'block';
    // };
    // span.onclick = () => {
    //   modal.style.display = 'none';
    //   unmatch();
    // };
    // window.onclick = (event) => {
    //   if (event.target === modal) {
    //     modal.style.display = "none";
    //     nextUser();
    //   }
    // };

    // set active user matched to true
    setData("users/" + user_id + "/Matched", true);
    activeUser.Matched = true;
    // set matched for current suggestion to true
    setData("users/" + allUsers[index].uid + "/Matched", true);
  };

  const unmatch = () => {
    // set active user matched to true
    setData("users/" + user_id + "/Matched", false);
    activeUser.Matched = false;
    // set matched for current suggestion to true
    setData("users/" + allUsers[index].uid + "/Matched", false);
  }

  // renders a list of overlap times between active user and displayed suggestion
  const renderOverlapTimes = () => {
    // console.log("user: "+ allUsers[index])
    // console.log("index: " + index)
    const overlap = ScheduleOverlap(activeUser, allUsers[index]);
    // schedule object is double nested, so need to map on days and times
    const rendered = Object.keys(overlap).map((day) => {
      return Object.keys(overlap[day]).map((time) => {
        if (overlap[day][time]) {
          
          return <li key={day + time}>{day}: {time}</li>;
        } else {
          return false;
        }
      });
    });

    // if no overlapping times, just return string
    return rendered.every(a => a.every(x => !x)) ? <li>{"No overlapping times :("}</li> : rendered;
  }

  const renderTraitCheckmark = (condition, text) => {
    if (condition) {
      return <li><FontAwesomeIcon icon={faCircleCheck} color="green"/> {text} </li>
    } else {
      return <li><FontAwesomeIcon icon={faCircleXmark} color="red"/> {text} </li>
    }
  };

  const RenderTraits = () => {
    const other = allUsers[index];
    return (
    <div className='checklist'>
      <div className='checkColumn'>
        <ul className='traitList'>
          {renderTraitCheckmark(activeUser.Location === other.Location, other.Location)}
          {renderTraitCheckmark(true, other.Major)}
        </ul>
      </div>
      <div className='checkColumn'>
        <ul className='traitList'>
          {renderTraitCheckmark(activeUser.Preference === other.Preference, other.Preference)}
          {renderTraitCheckmark(activeUser.Year === other.Year, other.Year)}
        </ul>
      </div>
    </div>
  )};

  const renderMatchedPopup = () => {
    if (activeUser.Matched) {
      return (
        <div id='popUp' className='matchedPopUp'>
          <div className="matchedPopUpContent">
            <div className="matchedPopUpText">
              <h2 data-cy="newMatch">You have a new Study Buddy!</h2>
              <p>You and <strong>{allUsers[index].Name}</strong> might be good Study Buddies! Reach out to <strong>{allUsers[index].Name}</strong> at <strong>{allUsers[index].Number}</strong>.</p>
            </div>
            <div className="close">
              <span className='closeText' onClick={unmatch}>No longer interested</span>
            </div>
          </div>
        </div>
      );
    } else {
      return ""
    }
  }


  // Description Popup Message. 
  const closeDesc = () => {
    const modal = document.getElementById('descPopUp');
    modal.style.display = "none";
  }

  // Days and hours for schedule.
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm'];
  const [available, setAvailable] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const short_days = ['Mo', "Tu", "We", "Th", "Fr", "Sa", "Su"]

  /// Filling Overlap Schedule ///

  useEffect(() => {
    const overlapTimes = [];

    const overlap = ScheduleOverlap(activeUser, allUsers[index])

    for (const day in overlap) {
        for (const hour in overlap[day]) {
          if (overlap[day][hour]) {
            overlapTimes.push({ day, hour });
          }
        }
    }

    // No overlap.
    if (overlapTimes.length === 0){
      setAvailable([]);
      document.getElementById('noOverlap').style.visibility = 'visible';
      document.getElementById("noOverlap").style.marginTop = "45px";
    }
    // Overlap
    else {
      setAvailable(overlapTimes)
      document.getElementById('noOverlap').style.visibility = 'hidden';
      document.getElementById("noOverlap").style.marginTop = "10px";
    }
    
    // Update pageLoaded state variable after component mounts.
    setPageLoaded(true);
 }, [nextUser]);
  
  return (
    <div>
      {/* Description Popup Message */}
      <div id='descPopUp' className='descPopUp'>
        <div className="descPopUpContent">
          <div className="descPopUpText">
            <h2> Welcome Study Buddy!</h2>
            <p>
              Find a compatible study buddy by comparing your overlapping availability, location, sleep habits, and other criteria.
            </p>
          </div>
          <div className="closeDesc" onClick={closeDesc}>
            <span>Continue</span>
          </div>
        </div>
      </div>
      
    <div className="suggestionContainer">
      {/* <img src={schedule} alt="schedule" className='schedule'></img> */}
      <div className='profileContainer'>
        <img src={'https://picsum.photos/100?random='+ String(index)} alt="profilePic" className='profilePic'></img>
        <div>
          <h2>{allUsers[index].Name} ({allUsers[index].Pronouns})</h2>
          <RenderTraits />
        </div>     
      </div>
      {/* <div className='lookingFor'>
       <h3 className='lookingTitle'>Looking for...</h3>
       <div className="listContainer">
         <div className="column">
           <ul>
             <li>Project partner</li>
             <li>Study group</li>
           </ul>
         </div>
         <div className="column">
           <ul>
             <li>Study partner</li>
           </ul>
         </div>
       </div>
      </div> */}
      <div className='overlap'>
        <h3>Availability Overlap</h3>
        <p id='noOverlap'>{"No overlapping times :("}</p>
        <div className='scheduleDisplayContainer'>
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
                        <input type="checkbox"
                            checked={pageLoaded && available.length > 0 ? available.some(item => item.day === day && item.hour === hour) : false}
                            disabled/>
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className='buttonContainer'>
        <button type="button" className='nextButton' onClick={nextUser}>
          Next User
        </button>
        <button id = 'interestedButton' type="button" className='interestButton' onClick={matched}>
          Interested
        </button>
        {renderMatchedPopup()}
      </div>
    </div>
    </div>
  );
}

export default Suggestion;