import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Wins() {
  const navigate = useNavigate();
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);

  // Handle clicks on the Admin text
  const handleAdminClick = () => {
    if (clickTimer) {
      clearTimeout(clickTimer); // Reset the timer on every click
    }

    const newClickCount = adminClickCount + 1;
    setAdminClickCount(newClickCount);

    if (newClickCount === 5) {
      navigate('/login'); // Redirect to the Login page
      resetClickCount(); // Reset the count after redirection
    } else {
      // Set a new timer to reset the count if 3 seconds pass without 5 clicks
      setClickTimer(
        setTimeout(() => {
          resetClickCount();
        }, 3000) // 3 seconds
      );
    }
  };

  // Reset the click count and timer
  const resetClickCount = () => {
    setAdminClickCount(0);
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    setClickTimer(null);
  };

  // Clean up the timer on component unmount
  useEffect(() => {
    return () => {
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
    };
  }, [clickTimer]);

  // Generalized method to handle window selection
  const handleWindowSelection = (window) => {
    const routes = {
      'Window 1': '/log1',
      'Window 2': '/log2',
      'Window 3': '/log3',
    };

    const route = routes[window];
    if (route) {
      navigate(route, { state: { selectedWindow: window } });
    } else {
      console.error('Unknown window selected');
    }
  };

  return (
    <div className="cont">
      <div className="header">
        {/* Admin text */}
        <div
          className="head-logo"
          onClick={handleAdminClick}
          style={{ cursor: 'default', userSelect: 'none' }} // Makes it look unclickable
        >
          SmartQueues-<span style={{ textDecoration: '' }}>Admin</span>
        </div>
        <div className="head-win">Finance Window</div>
      </div>

      <div className="button-wrapper">
        {/* Button for each window */}
        <button className="btn-1" onClick={() => handleWindowSelection('Window 1')}>
          Window 1
        </button>
        <button className="btn-2" onClick={() => handleWindowSelection('Window 2')}>
          Window 2
        </button>
        <button className="btn-3" onClick={() => handleWindowSelection('Window 3')}>
          Window 3
        </button>
      </div>
    </div>
  );
}

export default Wins;
