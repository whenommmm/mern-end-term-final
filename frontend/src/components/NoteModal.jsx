// frontend/src/components/NoteModal.jsx
import React from 'react';
import './NoteModal.css';

function NoteModal({ isOpen, onClose, onSave, editingNote }) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [editingNote]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call onSave with the note data. The parent (`App.jsx`) decides whether
    // to create or update based on its `editingNote` state.
    onSave({ title, content });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{editingNote ? 'Edit Note' : 'Add Note'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="5"
            required
          />
          <div className="modal-actions">
            <button type="submit">{editingNote ? 'Update' : 'Save'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoteModal;