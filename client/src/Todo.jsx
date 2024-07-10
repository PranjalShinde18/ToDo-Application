import React, { useState } from "react";

export default function Todo({ todo, setTodos, editTodo, deleteTodo }) {
  const { _id, todo: todoContent, subtitle, status, deadline } = todo;
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(todoContent);
  const [editedSubtitle, setEditedSubtitle] = useState(subtitle);
  const [editedDeadline, setEditedDeadline] = useState(deadline);
  const [editedStatus, setEditedStatus] = useState(status);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    if (editedContent.length > 3 && editedDeadline) {
      await editTodo(_id, editedContent, editedSubtitle, editedDeadline, editedStatus);
      setEditMode(false);
    }
  };

  return (
    <div className="todo">
      {editMode ? (
        <>
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <input
            type="text"
            value={editedSubtitle}  
            onChange={(e) => setEditedSubtitle(e.target.value)}
          />
          <input
            type="datetime-local"
            value={editedDeadline}
            onChange={(e) => setEditedDeadline(e.target.value)}
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Progress">In Progress</option>
            <option value="Complete">Complete</option>
          </select>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p>{todoContent}</p>
          <p>{subtitle}</p>
          <p className="todo__deadline">Deadline: {new Date(deadline).toLocaleString()}</p>
          <p className="todo__status-text">Status: {status}</p>
          <div className="mutations">
            <button
              className="todo__edit"
              onClick={handleEdit}
            >
              ✏️
            </button>
            <button
              className="todo__delete"
              onClick={() => deleteTodo(_id)}
            >
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
}
