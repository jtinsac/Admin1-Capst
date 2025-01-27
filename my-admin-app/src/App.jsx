import { Routes, Route } from 'react-router-dom';
import Window1 from './Pages/WindowAd1';
import LogAdmin1 from './Pages/LoginAd1';
import Users1 from './Pages/Users1';
import AddAccount from './Pages/AddAccount';
import Wins from './Pages/Wins';
import Dashboard1 from './Pages/Dashboard1';






function App1() {
  return (
    <>
    <div className="app-container">
      <Routes>
      <Route path="/dashboard1" element={<Dashboard1 />} />
        <Route path="/winad1" element={<Window1/>} />
        <Route path="/log1" element={<LogAdmin1 />} />
        <Route path="/users1" element={<Users1/>} />
        <Route path="/acc" element={<AddAccount />} />
        <Route path="/" element={<Wins/>} /> 
      </Routes>
    </div>
    </>
  );
}

export default App1;
