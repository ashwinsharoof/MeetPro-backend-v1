const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const multer = require('multer');

const storage = new GridFsStorage({
  db: mongoose.connection, // ✅ use the existing mongoose connection
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads', // this is the GridFS collection name (uploads.files & uploads.chunks)
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
