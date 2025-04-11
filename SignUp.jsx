// SignUp.jsx
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@ensta.edu.dz')) {
      setError('You must use a valid school email ending with @ensta.edu.dz.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save basic info
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        name: fullName,
        email: user.email,
        createdAt: new Date(),
        profilePicture: '', // empty for now
      });

      navigate('/complete-profile');
    } catch (err) {
      setError(err.message || 'Error creating your account.');
    }
  };

  return (
    <div>
      <h2>Create an Account</h2>
      <form onSubmit={handleSignUp}>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="School Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/signin">Log In</Link></p>
    </div>
  );
}

export default SignUp;


