import { useState, useEffect } from 'react';
import Dashboard from '../pages/Dashboard';
import { Route, Routes, Navigate } from 'react-router-dom';
import NavBar from '../components/Navbar/NavBar';
import Sidebar from '../components/Sidebar/Sidebar';
import CreatePost from '../components/CreatePost/CreatePost';
import Login from './Login';
import PostView from '../pages/PostView';
import Profile from '../pages/Profile/Profile';
import SavedPostView from '../pages/savedPosts/SavedPostView';
import HomePage from './HomePage';
import ChangePasswordView from '../components/ChangePassword/ChangePasswordView';

function App() {
  const [category, setCategory] = useState(0);
  const [isClick, setIsClick] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem('token')); // Ensure it reads from storage

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div>
      <NavBar setCategory={setCategory} setIsClick={setIsClick} setLoggedIn={setLoggedIn} isLoggedIn={isLoggedIn} />
      {isLoggedIn && <Sidebar clicked={isClick} category={category} setCategory={setCategory} />}
      
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setLoggedIn={setLoggedIn} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard clicked={isClick} category={category} /> : <Navigate to="/login" />} />
        <Route path="/posts/:category/:postid" element={isLoggedIn ? <PostView isClick={isClick} /> : <Navigate to="/login" />} />
        <Route path="/create-post" element={isLoggedIn ? <CreatePost /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login"/>} />
        <Route path="/saved" element={isLoggedIn ? <SavedPostView /> : <Navigate to="/login"/>} />
        <Route path="/change-password" element={isLoggedIn ? <ChangePasswordView /> : <Navigate to="/login"/>}  />
      </Routes>
    </div>
  );
}

export default App;
