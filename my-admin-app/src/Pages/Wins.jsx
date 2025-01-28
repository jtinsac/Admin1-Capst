import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from './firebase.config';
import { ref, onValue } from 'firebase/database';

function Wins() {
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState({
    Window1: 'Inactive',
    Window2: 'Inactive',
    Window3: 'Inactive',
  });

  // Fetch login statuses from Firebase
  useEffect(() => {
    const statusRef = ref(db, 'QueueSystemStatus');
    onValue(statusRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLoginStatus({
          Window1: data.Window1.LoginStatus,
          Window2: data.Window2.LoginStatus,
          Window3: data.Window3.LoginStatus,
        });
      }
    });
  }, []);

  // Handle window selection
  const handleWindowSelection = (window) => {
    if (loginStatus[window] === 'Inactive') {
      const routes = {
        Window1: '/log1',
        Window2: '/log2',
        Window3: '/log3',
      };
      navigate(routes[window], { state: { selectedWindow: window } });
    }
  };

  return (
    <div className="cont">
      <div className="header">
        <div className="head-logo">SmartQueues-<span>Admin</span></div>
        <div className="head-win">Finance Window</div>
      </div>

      <div className="button-wrapper">
        {['Window1', 'Window2', 'Window3'].map((window, index) => (
          <button
            key={index}
            className={`btn-${index + 1}`}
            onClick={() => handleWindowSelection(window)}
            disabled={loginStatus[window] === 'Active'}
            style={{
              backgroundColor: loginStatus[window] === 'Active' ? 'gray' : '',
              cursor: loginStatus[window] === 'Active' ? 'not-allowed' : 'pointer',
            }}
          >
            {loginStatus[window] === 'Active' ? 'Occupied' : `Window ${index + 1}`}
          </button>
        ))}
      </div>

      {/* Debugging: Show login statuses on screen */}
      <div className="status-display">
        <h3>Login Status:</h3>
        <p>Window 1: {loginStatus.Window1}</p>
        <p>Window 2: {loginStatus.Window2}</p>
        <p>Window 3: {loginStatus.Window3}</p>
      </div>
    </div>
  );
}

export default Wins;
