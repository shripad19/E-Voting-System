const express = require("express");
const multer = require("multer");
const Image = require("../models/imageModel");
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST Route to upload image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const newImage = new Image({
      name: req.body.name || "Untitled",
      imageUrl: req.file.path,
    });
    const savedImage = await newImage.save();
    console.log("Image saved to MongoDB:", savedImage);
    res.status(201).json({ message: "Image uploaded successfully", newImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET Route to retrieve all images
router.get("/", async (req, res) => {
  try {
    const images = await Image.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
