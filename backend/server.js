// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ---------- Middleware ---------
app.use(cors());
app.use(express.json());

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quicknotes')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ---------- Routes ----------
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);

// ---------- Root ----------
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to QuickNotes API' });
});

// ---------- Global Error Handler ----------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});