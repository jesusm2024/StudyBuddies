import './login-styles.css';
import logo from '../../assets/pics/logo.png';

const Login = (props) => {

  return (
    <div className='userWelcome'>
      <div className="welcome">
        <img className='logoImg' src={logo} alt="Study Buddies logo" />
        <h1>Welcome to Study Buddies</h1>
        <p>Make friends to study with</p>
      </div>
      <div className="connect">
        <h2>Let's Connect</h2>
        <div className='btn-container'>
          <button className="google-btn" type="button" onClick={props.signInWithGoogle}>
            <div className="google-icon-wrapper">
              <img className="google-icon" alt="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
            </div>
            <p className="btn-text"><b>Continue with Google</b></p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;