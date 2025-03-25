import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './login.css'
import { fas } from '@fortawesome/free-solid-svg-icons';
const Login = ({setLoggedIn}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState("");
  const [generalMessage, setGeneralMessage] = useState("");
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://classroom-hub.onrender.com/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneralMessage(data.message)
        setUsername('');
        setPassword('');

        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('name', data.fullname)
        localStorage.setItem('dept', data.dept)
        localStorage.setItem('year', data.year)
        localStorage.setItem('is_default_password', data.is_default_password)
        setTimeout(() => {
          setUserMessage("");
          setPasswordMessage("");
          setGeneralMessage("");
          setLoggedIn(true);
          console.log(password)
          if (data.is_default_password) {
            navigate('/change-password');
          } else {
            navigate('/dashboard'); 
          }
        }, 1500);
      } else {

          if (data.message) {
            if (data.message.username) {
              setUserMessage(data.message.username[0]);
              setPasswordMessage("");
              setGeneralMessage("");
            }
            if (data.message.password) {
              setUserMessage("");
              setPasswordMessage(data.message.password[0]);
              setGeneralMessage("");
            }
          }
        }
    } catch (error) {
      console.error('Error during login:', error);
      setGeneralMessage('An error occurred. Please try again later.');
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="container-width login-page">
      <div className='login-box'>
        <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <label>Username:</label> 
            <input type="text" value={username} required onChange={e => setUsername(e.target.value)} />
            
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
          <button type="submit">Login</button>
        </form>
        {userMessage && <p className="error">{userMessage}</p>}
        {passwordMessage && <p className="error">{passwordMessage}</p>}
        <p className={generalMessage === 'Login successful' ? 'success' : ''}>{generalMessage}</p>
        {loading ? <p>Loading...</p> : ""}
        </div>
        <div>
          <img src="/assets/login.jpeg" alt="inventory image" />
        </div>
      </div>
    </div>
  );
};

export default Login;
