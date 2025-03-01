import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome'


import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import Navigation from './components/Navigation'
import TalkToMe from './components/TalkToMe'

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('anxietyCompanionUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserSetup = (userData) => {
    setUser(userData);
    localStorage.setItem('anxietyCompanionUser', JSON.stringify(userData));
  };

  return (
    <div data-theme="acid" className='font-lato min-h-screen bg-base-100'>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/signin" element={<SignIn />} />
         <Route path="/signup" element={<SignUp />} />
         <Route path="/welcome" element={<Welcome />} />
         <Route path="/talktome" element={<TalkToMe />} />
      </Routes>
       
       
    </div>
  );
};

export default App
