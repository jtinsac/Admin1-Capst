import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState } from 'react';
import { database } from '../firebase.config';
import { ref, get, child, push, update } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';

function LogAdmin1() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedWindow = location.state?.selectedWindow || 'Window1'; // Default to Window1
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'admin'));

      if (snapshot.exists()) {
        const admins = snapshot.val();

        let isValid = false;
        let matchedAdmin = null;

        for (const key in admins) {
          if (
            admins[key].Username === username &&
            admins[key].Password === password
          ) {
            isValid = true;
            matchedAdmin = admins[key];
            break;
          }
        }

        if (isValid) {
          // Store the logged-in Username in localStorage
          localStorage.setItem('loggedInUsername', username);

          const loginHistoryRef = ref(database, 'Login_History');
          const now = new Date();

          await push(loginHistoryRef, {
            name: matchedAdmin.Name,
            date: now.toLocaleDateString(),
            time: now.toLocaleTimeString(),
            window: selectedWindow,
          });

          // Update the LoginStatus of Window1 to "Active"
          const windowRef = ref(database, `QueueSystemStatus/Window1`);
          await update(windowRef, { LoginStatus: 'Active' });

          navigate('/dashboard1');
        } else {
          toast.warn('Invalid credentials. Please try again.');
        }
      } else {
        toast.error('No admin data found in the database.');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="log-cont">
      <h2 className="logo">EasyQ's-Admin 1</h2>
      <div className="log-card">
        <div className="log-creds">
          <h2 className="credz">Username:</h2>
          <input
            className="inpz"
            type="text"
            placeholder="juandelacruz9"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <h2 className="credz">Password:</h2>
          <input
            className="inpz"
            type="password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="log-submit" onClick={handleLogin}>
            Submit
          </button>
        </div>
      <ToastContainer/>
      </div>
    </div>
  );
}

export default LogAdmin1;
