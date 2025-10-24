// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import NoteCard from './components/NoteCard.jsx';
import NoteModal from './components/NoteModal.jsx';
import SearchBar from './components/SearchBar.jsx';
import './App.css';
import './components/NoteCard.css';
import './components/NoteModal.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Load notes
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/notes');
      const data = await res.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  // Filter notes
  useEffect(() => {
    let filtered = notes;

    if (searchTerm) {
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(note => note.category === categoryFilter);
    }

    // Sort: pinned first
    filtered.sort((a, b) => b.isPinned - a.isPinned);
    setFilteredNotes(filtered);
  }, [notes, searchTerm, categoryFilter]);

  const handleSave = async (noteData, id) => {
    try {
      if (id) {
        // Update
        const res = await fetch(`http://localhost:5001/api/notes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        const updated = await res.json();
        setNotes(notes.map(n => n._id === id ? updated : n));
      } else {
        // Create
        const res = await fetch('http://localhost:5001/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        const newNote = await res.json();
        setNotes([...notes, newNote]);
      }
      setModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      alert('Failed to save note. Check console.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      await fetch(`http://localhost:5001/api/notes/${id}`, { method: 'DELETE' });
      setNotes(notes.filter(n => n._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handlePin = async (id) => {
    try {
      await fetch(`http://localhost:5001/api/notes/${id}/pin`, { method: 'PATCH' });
      setNotes(notes.map(n => n._id === id ? { ...n, isPinned: !n.isPinned } : n));
    } catch (err) {
      alert('Pin failed');
    }
  };

  const openModal = (note = null) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  return (
    <div className="app">
      <header>
        <h1>QuickNotes</h1>
        <button onClick={() => openModal()} className="add-btn">
          + New Note
        </button>
      </header>

      <SearchBar onSearch={setSearchTerm} />

      <div className="filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Ideas</option>
        </select>
      </div>

      <div className="notes-grid">
        {filteredNotes.length === 0 ? (
          <p className="empty">No notes yet. Create one!</p>
        ) : (
          filteredNotes.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => openModal(note)}
              onDelete={() => handleDelete(note._id)}
              onPin={() => handlePin(note._id)}
            />
          ))
        )}
      </div>

      <NoteModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSave}
        editingNote={editingNote}
      />
    </div>
  );
}

export default App;