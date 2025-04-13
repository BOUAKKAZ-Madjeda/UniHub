import React from 'react';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <div className="header-content">
          <h1 className="logo">UNIHUB</h1>

          <div className="search-container">
            <input type="text" placeholder="Search..." className="search-input" />
            <span className="search-icon">🔍</span>
          </div>

          <div className="header-right">
            <Link to="/profile" className="profile-circle" title="Go to Profile">
              👤
            </Link>
            <button onClick={handleSignOut} className="sign-out-btn">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* First Row */}
        <div className="features-row">
          <FeatureCard 
            title="Lost & Found" 
            description="Report lost or found items" 
          />
          <FeatureCard 
            title="Study Resources" 
            description="Share and access course materials" 
          />
          <FeatureCard 
            title="Events" 
            description="Discover campus events" 
          />
        </div>

        {/* Second Row (just titles) */}
        <div className="features-row">
          <div className="feature-card">
            <h2>Lost & Found</h2>
          </div>
          <div className="feature-card">
            <h2>Study Resources</h2>
          </div>
          <div className="feature-card">
            <h2>Events</h2>
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="feature-card">
    <h2>{title}</h2>
    <p>{description}</p>
    <button className="explore-btn">Explore</button>
  </div>
);

export default Home;
                        


