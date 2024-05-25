import React, { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    async function getTodos() {
      const res = await fetch("/api/todos");
      const todos = await res.json();

      setTodos(todos);
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3 && deadline) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content, deadline }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setDeadline("");
      setTodos([...todos, newTodo]);
    }
  };

  const editTodo = async (id, editedContent, editedDeadline) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ todo: editedContent, deadline: editedDeadline }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedTodo = await res.json();
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, todo: editedContent, deadline: editedDeadline } : todo
      )
    );
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  return (
    <main className="container">
      <h1 className="title">Todo Application</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="form__input"
          required
        />
        <button className="form__button" type="submit">
          Create Todo
        </button>
      </form>
      <div className="todos">
        {todos.length > 0 &&
          todos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos} editTodo={editTodo} deleteTodo={deleteTodo} />
          ))}
      </div>
    </main>
  );
}
