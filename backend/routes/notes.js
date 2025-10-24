// backend/routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/notes');

// ---------- GET all ----------
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find()
      .sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- GET one ----------
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- CREATE ----------
router.post('/', async (req, res) => {
  const note = new Note({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category || 'General',
    isPinned: req.body.isPinned ?? false,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- UPDATE ----------
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (req.body.title != null) note.title = req.body.title;
    if (req.body.content != null) note.content = req.body.content;
    if (req.body.category != null) note.category = req.body.category;
    if (req.body.isPinned != null) note.isPinned = req.body.isPinned;

    const updated = await note.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ---------- DELETE ----------
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await note.remove();               // <-- correct for document instance
    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------- PATCH: toggle pin ----------
router.patch('/:id/pin', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isPinned = !note.isPinned;
    const updated = await note.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;