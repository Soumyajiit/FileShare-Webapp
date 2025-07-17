const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Session = require('../models/session');

const router = express.Router();

// ✅ Ensure 'uploads' folder exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // use absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Upload route
router.post('/upload', upload.single('file'), async (req, res) => {
  console.log("UPLOAD ROUTE HIT");
  try {
    const sessionId = Math.random().toString(36).substring(2, 12);
    const newSession = new Session({
      sessionId,
      files: [{
        originalname: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype
      }]
    });
    await newSession.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      sessionId,
      link: `http://localhost:4200/session/${sessionId}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'File upload failed' });
  }
  console.log('Uploaded file:', req.file);

});

module.exports = router;


// GET /api/session/:sessionId
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await Session.findOne({ sessionId: req.params.sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId: session.sessionId,
      expiresAt: session.expiresAt,
      files: session.files
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});


module.exports = router;
