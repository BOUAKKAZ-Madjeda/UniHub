import express from "express";
import cloudinary from "../cloudinary.js";

const router = express.Router();

router.post("/delete", async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return res.status(400).json({ error: "Missing publicId" });

  try {
    await cloudinary.uploader.destroy(publicId);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

export default router;
