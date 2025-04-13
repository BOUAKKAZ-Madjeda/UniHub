import React, { useEffect, useState } from 'react';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import './Profile.css';

function Profile() {
  const user = auth.currentUser;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name || '');
          setEmail(data.email || '');
          setProfilePicture(data.profilePicture || '');
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleUpdate = async () => {
    setStatus('Saving...');
    try {
      let imageUrl = profilePicture;

      if (newImage) {
        // Compress image
        const compressedImage = await imageCompression(newImage, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });

        // Prepare upload form
        const formData = new FormData();
        formData.append('file', compressedImage);
        formData.append('upload_preset', 'unihub_profile_photos'); // 🔁 Change this!
        formData.append('folder', 'uni-hub/profilePhotos'); // Optional organization

        // Upload to Cloudinary
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dkfkujows/image/upload', // 🔁 Change this!
          formData
        );

        imageUrl = response.data.secure_url;
      }

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        name,
        profilePicture: imageUrl,
      });

      setProfilePicture(imageUrl);
      setNewImage(null);
      setStatus('✅ Profile updated!');
    } catch (error) {
      console.error(error);
      setStatus('❌ Error updating profile.');
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-photo-container">
        <img
          src={newImage ? URL.createObjectURL(newImage) : profilePicture || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="profile-photo"
        />
        <label className="change-photo-label">
          Change Photo
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewImage(e.target.files[0])}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      <div className="profile-details">
        <label>Email:</label>
        <input type="email" value={email} disabled className="profile-input" />
        <label>Name:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="profile-input" />
        <button onClick={handleUpdate} className="edit-button">Save Changes</button>
        {status && <p className="status-message">{status}</p>}
      </div>
    </div>
  );
}

export default Profile;



