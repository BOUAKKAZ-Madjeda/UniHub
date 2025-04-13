import React, { useState } from "react";
import axios from "axios";

const ProfilePhotoUploader = ({ currentPhotoUrl, onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentPhotoUrl ? currentPhotoUrl.url : "");
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    // Include the old public_id if it exists
    if (currentPhotoUrl && currentPhotoUrl.public_id) {
      formData.append("old_public_id", currentPhotoUrl.public_id);  // Pass old public_id for deletion
    }

    try {
      // Make POST request to backend for image upload
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { url, public_id } = res.data; // Get the signed URL and public ID
      setImageUrl(url); // Set the private image URL to the state

      // Optional: Notify parent component about the new image
      if (onImageUploaded) {
        onImageUploaded(url, public_id);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover"
        />
      )}
    </div>
  );
};

export default ProfilePhotoUploader;




