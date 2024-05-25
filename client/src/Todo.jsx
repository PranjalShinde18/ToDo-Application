import React, { useState } from "react";

export default function Todo({ todo, setTodos, editTodo, deleteTodo }) {
  const { _id, todo: todoContent, status, deadline } = todo;
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(todoContent);
  const [editedDeadline, setEditedDeadline] = useState(deadline);

  const updateTodo = async (todoId, todoStatus) => {
    const res = await fetch(`/api/todos/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ status: todoStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) => {
        return currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, status: !currentTodo.status };
          }
          return currentTodo;
        });
      });
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    if (editedContent.length > 3 && editedDeadline) {
      await editTodo(_id, editedContent, editedDeadline);
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
            type="datetime-local"
            value={editedDeadline}
            onChange={(e) => setEditedDeadline(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <>
          <p>{todoContent}</p>
          <p className="todo__deadline">Deadline: {new Date(deadline).toLocaleString()}</p>
          <div className="mutations">
            <button
              className="todo__status"
              onClick={() => updateTodo(_id, status)}
            >
              {status ? "☑" : "☐"}
            </button>
            <button className="todo__edit" onClick={handleEdit}>
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
