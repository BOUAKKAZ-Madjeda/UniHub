import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState({ email: false, google: false });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(prev => ({ ...prev, email: true }));

    if (!email.endsWith('@ensta.edu.dz')) {
      setError('Email must end with @ensta.edu.dz');
      setLoading(prev => ({ ...prev, email: false }));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(prev => ({ ...prev, email: false }));
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(prev => ({ ...prev, google: true }));

    try {
      const result = await signInWithPopup(auth, provider);
      if (!result.user.email.endsWith('@ensta.edu.dz')) {
        setError('Only @ensta.edu.dz emails allowed.');
        await auth.signOut();
        return;
      }
      navigate('/home');
    } catch (err) {
      setError('Google sign-in failed.');
    } finally {
      setLoading(prev => ({ ...prev, google: false }));
    }
  };

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form onSubmit={handleEmailSignIn}>
        <label>Email</label>
        <input type="email" value={email} required onChange={e => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} required onChange={e => setPassword(e.target.value)} />
        {error && <p className="error-message">{error}</p>}
        <button disabled={loading.email}>{loading.email ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <div>
        <button onClick={handleGoogleSignIn} disabled={loading.google}>
          {loading.google ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
      <p>
        No account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default SignIn;

