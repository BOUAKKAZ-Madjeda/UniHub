import express from 'express';
import multer from 'multer';
import fs from 'fs';
import cloudinary from './cloudinaryConfig.js'; // Import your cloudinary config
import cors from 'cors';

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// API Route for handling image upload
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // Check if old public_id is passed, and delete the old image
    if (req.body.old_public_id) {
      console.log('Attempting to delete old image with public_id:', req.body.old_public_id);
      const deletionResponse = await cloudinary.uploader.destroy(req.body.old_public_id);
      console.log('Delete response:', deletionResponse); // Log the deletion response to verify if it's successful
    }

    // Upload the new image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uni-hub/users',
      access_mode: 'authenticated',
    });

    // Clean up the temporary file after upload
    fs.unlinkSync(req.file.path);

    // Respond with the new image URL and public_id
    res.json({
      url: result.secure_url,  // New secure URL
      public_id: result.public_id,  // New public_id to store in your database or front end
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Set the server to listen on port 5000
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});



