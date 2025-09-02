"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TasksTab() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskText, setTaskText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | done
  const [query, setQuery] = useState("");
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/tasks")
      .then((res) => {
        if (mounted) setTasks(res.data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
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

  const handleDelete = async (id) => {
    await axios.delete("/api/tasks", { data: { id } });
    setTasks(tasks.filter((t) => t._id !== id));
    toast.success("Task deleted", { position: "top-right" });
  };

  const updateTaskMeta = async (id, payload) => {
    // Optimistic update
    const prev = tasks;
    const optimistic = tasks.map((t) =>
      t._id === id ? { ...t, ...payload } : t
    );
    setTasks(optimistic);
    try {
      const res = await axios.patch("/api/tasks", { id, ...payload });
      setTasks((cur) => cur.map((t) => (t._id === id ? res.data : t)));
      toast.success("Updated", { position: "top-right" });
    } catch (e) {
      console.error(e);
      setTasks(prev);
      toast.error("Failed to update", { position: "top-right" });
    }
  };

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (filter === "active") list = list.filter((t) => !t.done);
    if (filter === "done") list = list.filter((t) => t.done);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }
    return list;
  }, [tasks, filter, query]);

  const onDragStart = (id) => setDraggingId(id);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = async (targetId) => {
    if (!draggingId || draggingId === targetId) return;
    const current = [...tasks];
    const draggedIndex = current.findIndex((t) => t._id === draggingId);
    const targetIndex = current.findIndex((t) => t._id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const [dragged] = current.splice(draggedIndex, 1);
    current.splice(targetIndex, 0, dragged);

    // Reassign order locally for smooth UX
    const reordered = current.map((t, idx) => ({ ...t, order: idx }));
    setTasks(reordered);
    setDraggingId(null);

    // Persist new order for all tasks affected
    // To minimize API calls, send only the changed ones
    const updates = reordered
      .filter((t, idx) => t.order !== tasks.find((x) => x._id === t._id)?.order)
      .map((t) => axios.patch("/api/tasks", { id: t._id, order: t.order }));
    try {
      await Promise.all(updates);
      toast.success("Order updated", { position: "top-right" });
    } catch (e) {
      toast.error("Failed to save order", { position: "top-right" });
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Your Tasks</h2>
        <div className="text-sm text-gray-600">
          <span className="mr-3">All: {tasks.length}</span>
          <span className="mr-3">Active: {tasks.filter((t) => !t.done).length}</span>
          <span>Done: {tasks.filter((t) => t.done).length}</span>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="sm:col-span-2 flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Add a new task"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {[
          { key: "all", label: "All" },
          { key: "active", label: "Active" },
          { key: "done", label: "Done" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              filter === f.key
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-md border border-gray-200 p-6 text-center text-gray-600">
          Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-md border border-gray-200 p-6 text-center">
          <p className="text-gray-700 font-medium mb-1">No tasks found</p>
          <p className="text-sm text-gray-500">Try changing filters or add a new task.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task._id}
              className="group flex items-center justify-between bg-white p-3 rounded-md border border-gray-200 hover:border-gray-300 hover:shadow-sm transition"
              onDragOver={onDragOver}
              onDrop={() => onDrop(task._id)}
            >
              {editId === task._id ? (
                <div className="flex-1 flex gap-2 items-center">
                  <input
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(task._id);
                      if (e.key === "Escape") handleEditCancel();
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(task._id)}
                    className="bg-green-600 text-white px-3 py-2 rounded-md text-sm hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md text-sm hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      title="Drag to reorder"
                      className="cursor-grab text-gray-400 hover:text-gray-600 px-1"
                      draggable
                      onDragStart={() => onDragStart(task._id)}
                      onDragEnd={() => setDraggingId(null)}
                    >
                      ⋮⋮
                    </button>
                    <input
                      type="checkbox"
                      checked={!!task.done}
                      onChange={() => toggleDone(task._id, task.done)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`truncate ${
                        task.done ? "line-through text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {task.text}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Priority badge */}
                      <select
                        value={task.priority || "medium"}
                        onChange={(e) => updateTaskMeta(task._id, { priority: e.target.value })}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 rounded border border-gray-200 bg-gray-50 text-gray-700"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      {/* Due date */}
                      <input
                        type="date"
                        value={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""}
                        onChange={(e) => updateTaskMeta(task._id, { dueDate: e.target.value || null })}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 items-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-sm text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-sm text-red-700 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleDone(task._id, task.done)}
                      className="text-sm text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      {task.done ? "Undo" : "Done"}
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
