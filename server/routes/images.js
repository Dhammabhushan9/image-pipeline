import express from 'express';
import multer from 'multer';
import path from 'path';
import ImagePair from '../models/ImagePair.js';

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Get all image pairs
router.get('/', async (req, res) => {
  try {
    const pairs = await ImagePair.find().sort({ createdAt: -1 });
    res.json(pairs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new image pair
router.post('/', async (req, res) => {
  try {
    const { originalImage, maskImage } = req.body;
    
    // Save base64 images
    const originalFileName = `original_${Date.now()}.png`;
    const maskFileName = `mask_${Date.now()}.png`;
    
    const originalBuffer = Buffer.from(originalImage.split(',')[1], 'base64');
    const maskBuffer = Buffer.from(maskImage.split(',')[1], 'base64');
    
    await Promise.all([
      fs.promises.writeFile(`uploads/${originalFileName}`, originalBuffer),
      fs.promises.writeFile(`uploads/${maskFileName}`, maskBuffer)
    ]);

    const imagePair = new ImagePair({
      originalImage: `/uploads/${originalFileName}`,
      maskImage: `/uploads/${maskFileName}`
    });

    const newPair = await imagePair.save();
    res.status(201).json(newPair);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;