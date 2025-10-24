import { useState, useEffect } from 'react';
import './App.css';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import SearchBar from './components/SearchBar';

const API_URL = 'https://mern-end-term-final.onrender.com/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setNotes(data);
      setFilteredNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Filter notes based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = notes.filter(note => {
        const title = (note.title || '').toLowerCase();
        const content = (note.content || '').toLowerCase();
        const category = (note.category || '').toLowerCase();
        return (
          title.includes(q) ||
          content.includes(q) ||
          category.includes(q)
        );
      });
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  // Add or update note
  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        // Update existing note
        const response = await fetch(`${API_URL}/${editingNote._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        const updatedNote = await response.json();
        setNotes(notes.map(note => 
          note._id === updatedNote._id ? updatedNote : note
        ));
      } else {
        // Create new note
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData)
        });
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
      }
      setIsModalOpen(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Delete note
  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        setNotes(notes.filter(note => note._id !== id));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  // Toggle pin status
  const handleTogglePin = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}/pin`, {
        method: 'PATCH'
      });
      const updatedNote = await response.json();
      setNotes(notes.map(note => 
        note._id === updatedNote._id ? updatedNote : note
      ));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  // Open modal for editing
  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // Open modal for new note
  const handleAddNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>📝 QuickNotes</h1>
        <p className="subtitle">Capture your thoughts instantly</p>
      </header>

      <div className="container">
        <div className="controls">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <button className="btn btn-primary" onClick={handleAddNote}>
            + New Note
          </button>
        </div>

        <div className="notes-grid">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchQuery 
                  ? 'No notes found matching your search.' 
                  : 'No notes yet. Create your first note!'}
              </p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <NoteCard
                key={note._id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
                onTogglePin={handleTogglePin}
              />
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <NoteModal
          isOpen={isModalOpen}
          editingNote={editingNote}
          onSave={handleSaveNote}
          onClose={() => {
            setIsModalOpen(false);
            setEditingNote(null);
          }}
        />
      )}
    </div>
  );
}

export default App;