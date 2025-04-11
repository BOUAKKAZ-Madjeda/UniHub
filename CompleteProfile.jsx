// CompleteProfile.jsx
import React, { useState } from 'react';
import { auth, db, storage } from './firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image || !auth.currentUser) return;

    setUploading(true);
    const imageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`);
    await uploadBytes(imageRef, image);
    const downloadURL = await getDownloadURL(imageRef);

    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      profilePicture: downloadURL,
    });

    setUploading(false);
    alert('Profile completed!');
    navigate('/profile'); // or any main/home page
  };

  return (
    <div>
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Profile Picture'}
        </button>
      </form>
    </div>
  );
}

export default CompleteProfile;
