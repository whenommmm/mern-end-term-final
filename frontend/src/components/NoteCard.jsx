// frontend/src/components/NoteCard.jsx
import React from 'react';
import './NoteCard.css';

function NoteCard({ note, onEdit, onDelete }) {
  return (
    <div className="note-card">
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <div className="note-actions">
        <button onClick={() => onEdit(note)} className="edit-btn">Edit</button>
        <button onClick={() => onDelete(note._id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
}

export default NoteCard;