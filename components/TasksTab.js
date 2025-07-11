"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TasksTab() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    axios.get("/api/tasks").then((res) => setTasks(res.data));
  }, []);

  const handleAdd = async () => {
    if (!taskText.trim()) return;
    const res = await axios.post("/api/tasks", { text: taskText });
    setTasks([res.data, ...tasks]);
    setTaskText("");
    toast.success("Task added successfully!", { position: "top-right" });
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setEditText(task.text);
  };

  const handleEditSave = async (id) => {
    const res = await axios.patch("/api/tasks", { id, text: editText });
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    setEditId(null);
    setEditText("");
    toast.success("Task updated!", { position: "top-right" });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditText("");
  };

  const toggleDone = async (id, done) => {
    const res = await axios.patch("/api/tasks", { id, done: !done });
    setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4 text-black">Your Tasks</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border p-2 text-black"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Add a new task"
        />
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-white p-3 rounded shadow"
          >
            {editId === task._id ? (
              <div className="flex-1 flex gap-2 items-center">
                <input
                  className="flex-1 border p-2 text-black"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button
                  onClick={() => handleEditSave(task._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className={task.done ? "line-through text-gray-500" : "text-black"}>
                  {task.text}
                </span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-sm text-blue-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleDone(task._id, task.done)}
                    className="text-sm text-blue-500"
                  >
                    {task.done ? "Undo" : "Done"}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
