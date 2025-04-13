const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

cloudinary.config({
  cloud_name: "your-cloud-name",
  api_key: "your-api-key",
  api_secret: "your-api-secret",
});

app.post("/delete-image", async (req, res) => {
  const { public_id } = req.body;
  if (!public_id) return res.status(400).send("Missing public_id");

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Export the function
exports.api = functions.https.onRequest(app);
