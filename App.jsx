import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import ForgotPassword from './ForgotPassword'; // Forgot Password component
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import UserDashboard from './UserDashboard'; // Add UserDashboard for logged-in users
import CompleteProfile from './CompleteProfile'; // Add this import


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated when app loads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe(); // Clean up the listener when component unmounts
  }, []);

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm("Are you sure you want to sign out?");
    if (!confirmSignOut) return; // Cancel if user clicks "No"
  
    try {
      await signOut(auth);
      alert("Signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Error signing out");
    }
  };
  

  if (loading) {
    return <p>Loading...</p>; // Show loading message while waiting for auth state
  }

  return (
    <Router>
      <div>
        <h1>Firebase Authentication</h1>
        {user ? (
          <div>
            {/* Show the user's dashboard if they're logged in */}
            <p>Welcome, {user.email}</p>
            <button onClick={handleSignOut}>Sign Out</button>
            <UserDashboard /> {/* Your User Dashboard */}
          </div>
        ) : (
          <Routes>
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/" element={<Navigate to="/signin" />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;


