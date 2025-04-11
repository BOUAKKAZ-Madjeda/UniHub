// SignIn.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebaseConfig';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const provider = new GoogleAuthProvider();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate email domain
    if (!email.endsWith('@ensta.edu.dz')) {
      setError('You must use a valid school email ending with @ensta.edu.dz.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Signed in successfully!');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Validate email domain for Google Sign-In
      if (!user.email.endsWith('@ensta.edu.dz')) {
        setError('You must use a valid school email ending with @ensta.edu.dz.');
        await auth.signOut(); // Log out if email is invalid
        return;
      }

      alert('Signed in with Google successfully!');
    } catch (err) {
      setError(err.message || 'An error occurred while signing in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Welcome Back!</h2>
      <form onSubmit={handleEmailSignIn}>
        <label htmlFor="email">Enter your email</label>
        <input 
          id="email"
          type="email" 
          placeholder="Enter your school email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <label htmlFor="password">Enter your password</label>
        <input 
          id="password"
          type="password" 
          placeholder="Enter your password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Log In'}
        </button>
      </form>
      <p><a href="/forgot-password">Forgot Password?</a></p>
      <p>OR</p>
      <button onClick={handleGoogleSignIn} disabled={loading}>
        {loading ? 'Signing In...' : 'Continue with Google'}
      </button>
      <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
  );
}

export default SignIn;
