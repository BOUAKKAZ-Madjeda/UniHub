// ForgotPassword.jsx
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebaseConfig';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validate email domain
    if (!email.endsWith('@ensta.edu.dz')) {
      setError('You must use a valid school email ending with @ensta.edu.dz.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.message || 'An error occurred while sending the reset email.');
    }
  };

  return (
    <div>
      <h2>Forgot Password?</h2>
      <p>Enter your email to receive a password reset link.</p>
      <form onSubmit={handleResetPassword}>
        <label htmlFor="email">Email</label>
        <input 
          id="email"
          type="email" 
          placeholder="Enter your school email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit">Send Reset Link</button>
      </form>
      <p><a href="/signin">Back to Sign In</a></p>
    </div>
  );
}

export default ForgotPassword;