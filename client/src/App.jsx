import React, { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
  const [filter, setFilter] = useState("all");

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
        body: JSON.stringify({ todo: content, subtitle, deadline, status }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setSubtitle("");
      setDeadline("");
      setStatus("Pending");
      setTodos([...todos, newTodo]);
    }
  };

  const editTodo = async (id, editedContent, editedSubtitle, editedDeadline, editedStatus) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ todo: editedContent, subtitle: editedSubtitle, deadline: editedDeadline, status: editedStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedTodo = await res.json();
    setTodos(
      todos.map((todo) =>
        todo._id === id ? { ...todo, todo: editedContent, subtitle: editedSubtitle, deadline: editedDeadline, status: editedStatus } : todo
      )
    );
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    setTodos(todos.filter((todo) => todo._id !== id));
  };

  const filterTodos = (status) => {
    setFilter(status);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    return todo.status === filter;
  });

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
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Enter a subtitle..."
          className="form__input"
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="form__input"
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="form__input"
          required
        >
          <option value="Pending">Pending</option>
          <option value="Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>
        <button className="form__button" type="submit">
          Create Todo
        </button>
      </form>
      <div className="filter-buttons">
        <button onClick={() => filterTodos("all")}>All</button>
        <button onClick={() => filterTodos("Pending")}>Pending</button>
        <button onClick={() => filterTodos("Progress")}>In Progress</button>
        <button onClick={() => filterTodos("Complete")}>Complete</button>
      </div>
      <div className="todos">
        {filteredTodos.length > 0 &&
          filteredTodos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos} editTodo={editTodo} deleteTodo={deleteTodo} />
          ))}
      </div>
    </main>
  );
}
