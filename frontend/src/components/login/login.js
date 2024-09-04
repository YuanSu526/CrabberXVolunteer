import React, { useState, useEffect } from "react";
import { useUser } from '../user-context/user-context';
import "./login.css";

const apiUrl = process.env.REACT_APP_API_URL;
console.log('URL: ', apiUrl);

function Login() {

  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [employeeid, setEmployeeid] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVolunteer, setIsVolunteer] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const { setUserId } = useUser();

  async function logIn(firstname, lastname, password) {

    const role = isVolunteer ? 'volunteer' : 'supervisor';

    try {
        const response = await fetch(`${apiUrl}/${role}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('User logged in successfully:', data.message);
            alert('User logged in successfully!');

            let userId;

            if (isVolunteer) {

              userId = await getVolunteerIDByName(firstname, lastname);

            } else {

              userId = await getSupervisorIDByName(firstname, lastname);

            }

            setUserId(userId);
            return true;
            
        } else {
            console.error('Error logging in user:', data.message);
            alert('Error logging in user: ' + data.message);
            return false;
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
        alert('Error connecting to the server.');
        return false;
    }
  }

  async function volunteerSignUp(firstname, lastname, employeeid, password) {

    try {
        const response = await fetch(`${apiUrl}/volunteer/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                employeeid,
                password
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Volunteer signed up successfully:', data.message);
            alert('Volunteer signed up successfully!');
            return true;
        } else {
            console.error('Error signing up volunteer:', data.message);
            alert('Error signing up volunteer: ' + data.message);
            return false;
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
        alert('Error connecting to the server.');
        return false;
    }
  }

  async function supervisorSignUp(firstname, lastname, password, phone) {

    try {
        const response = await fetch(`${apiUrl}/supervisor/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                password,
                phone
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Supervisor signed up successfully:', data.message);
            alert('Supervisor signed up successfully!');
            return true;
        } else {
            console.error('Error signing up supervisor:', data.message);
            alert('Error signing up supervisor: ' + data.message);
            return false;
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
        alert('Error connecting to the server.');
        return false;
    }
  }

  async function bindSupervisorEmail(firstname, lastname, email, employeeid) {

    try {
        const response = await fetch(`${apiUrl}/supervisor/email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname,
                email,
                employeeid
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Email bound to supervisor successfully:', data.message);
            alert('Email bound to supervisor successfully!');
            return true;
        } else {
            console.error('Error binding email to supervisor:', data.message);
            alert('Error binding email to supervisor: ' + data.message);
            return false;
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
        alert('Error connecting to the server.');
        return false;
    }
  }

  async function getSupervisorIDByName(firstname, lastname) {

    try {
        const response = await fetch(`${apiUrl}/supervisor/employeeid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Fetching supervisor ID by name successfully:', data.message);
            return data.employeeid;
        } else {
            console.error('Error fetching supervisor ID by name:', data.message);
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
    }
  }

  async function getVolunteerIDByName(firstname, lastname) {

    try {
        const response = await fetch(`${apiUrl}/volunteer/volunteerid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname,
                lastname
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('Fetching volunteer ID by name successfully:', data.message);
            return data.volunteerid;
        } else {
            console.error('Error fetching volunteer ID by name:', data.message);
        }
    } catch (error) {
        console.error('Error connecting to the server:', error);
    }
  }


  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleEmployeeIDChange = (e) => {
    setEmployeeid(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleSwitchRole = () => {
    setIsVolunteer(!isVolunteer);
  };
  const handleSwitchSigningUp = () => {
    setIsSigningUp(!isSigningUp);
  }
  const handlePublicLogin = () => {
    window.location.href = "/public/general-insight";
  }

  const handleLogin = async () => {

    try {

      if (await logIn(firstname, lastname, password)) {

        window.location.href = isVolunteer ? "/volunteer/dashboard" : "/supervisor/dashboard";

      } else throw new Error('Failed to log in user');

    } catch (error) {
      console.error('Log-in error:', error);
      setNotificationMessage(`Error: ${error.message}`);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }
  };

  const handleSignUp = async () => {

    try {

      if (password !== confirmPassword) {

        setNotificationMessage('Passwords do not match!');
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 2000);

        return;

      }
    
      if (isVolunteer) {

        const response = await volunteerSignUp(firstname, lastname, employeeid, password);
  
        if (response) {

          window.location.href = "/volunteer/dashboard";

        } else throw new Error('Failed to sign up volunteer');
        
      } else {

        const response = await supervisorSignUp(firstname, lastname, password, phone);
        
        if (response) {

          const generatedEmployeeid = await getSupervisorIDByName(firstname, lastname);

          const emailResponse = await bindSupervisorEmail(firstname, lastname, email, generatedEmployeeid);
  
          if (emailResponse) {

            window.location.href = "/supervisor/dashboard";

          } else throw new Error('Failed to bind email to supervisor');
        
        } else throw new Error('Failed to sign up supervisor');
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setNotificationMessage(`Error: ${error.message}`);
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }
  };


  return (
    <div id="main">
      <div className="loginContainer">

        <div>
          <p className="title">First Name</p>
          <input 
            type="text" 
            className="inputBox" 
            placeholder={isVolunteer? "Volunteer" : "Supervisor"} 
            onChange={handleFirstNameChange}
          />
        </div>

        <div>
          <p className="title">Last Name</p>
          <input 
            type="text" 
            className="inputBox" 
            placeholder={isVolunteer? "Volunteer" : "Supervisor"} 
            onChange={handleLastNameChange}
          />
        </div>

        {(isSigningUp && isVolunteer) ? 
          <div>
            <p className="title">Supervisor ID</p>
            <input
              type="text" 
              className="inputBox" 
              placeholder="123" 
              onChange={handleEmployeeIDChange}
            />
          </div>
         : 
          <></>
        }

        {(isSigningUp && !isVolunteer) ? 
          <div>
            <p className="title">Phone</p>
            <input
              type="text" 
              className="inputBox" 
              placeholder="123-456-7890" 
              onChange={handlePhoneChange}
            />
          </div>
         : 
          <></>
        }

        {(isSigningUp && !isVolunteer) ? 
          <div>
            <p className="title">Email</p>
            <input
              type="text" 
              className="inputBox" 
              placeholder="example@gmail.com" 
              onChange={handleEmailChange}
            />
          </div>
         : 
          <></>
        }

        <div>
          <p className="title">Password</p>
          <input
            type="password" 
            className="inputBox" 
            placeholder="123abc@" 
            onChange={handlePasswordChange}
          />
        </div>

        {isSigningUp ? 
          <div>
            <p className="title">Confirm Password</p>
            <input
              type="password" 
              className="inputBox" 
              placeholder="123abc@" 
              onChange={handleConfirmPasswordChange}
            />
          </div>
         : 
          <></>
        }

        <div className="buttonContainer">
          <button className="loginButton" onClick={isSigningUp ? handleSignUp : handleLogin}>
            {isSigningUp ? "Sign Up" : "Login"}
          </button>
        </div>
        
        <p className="switchLink" onClick={handleSwitchRole}>
          Click to {isSigningUp ? "Sign Up" : "Login"} as {isVolunteer ? "Supervisor" : "Volunteer"}
        </p>
        
        <p className="switchLink" onClick={handleSwitchSigningUp}>
          I want to {isSigningUp ? "Login" : "Sign Up"}
        </p>

        <p className="switchLink" onClick={handlePublicLogin}>
          Guest? See our public page!
        </p>

      </div>
      {showNotification && (
        <div className="login-notification">
          {notificationMessage}
        </div>
      )}
    </div>
  );
}

export default Login;
