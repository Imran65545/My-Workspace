"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NotesTab() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [summaries, setSummaries] = useState({}); // key: noteId
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    axios.get("/api/notes").then((res) => setNotes(res.data));
  }, []);

  const handleAdd = async () => {
    if (!noteText.trim()) return;
    const res = await axios.post("/api/notes", { content: noteText });
    setNotes([res.data, ...notes]);
    setNoteText("");
  };

  const handleEdit = (note) => {
    setEditId(note._id);
    setEditText(note.content);
  };

  const handleEditSave = async (id) => {
    const res = await axios.patch("/api/notes", { id, content: editText });
    setNotes(notes.map((n) => (n._id === id ? res.data : n)));
    setEditId(null);
    setEditText("");
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditText("");
  };

  const handleDelete = async (id) => {
    await axios.delete("/api/notes", { data: { id } });
    setNotes(notes.filter((n) => n._id !== id));
  };

  const handleSummarize = async (note) => {
    setSummaries((prev) => ({ ...prev, [note._id]: "Loading..." }));
    const res = await axios.post("/api/summarize", { content: note.content });
    setSummaries((prev) => ({ ...prev, [note._id]: res.data.summary }));
  };

  return (
    <div>
      <h2 className="text-xl text-blue-600 font-bold mb-4">Your Notes</h2>
      <textarea
        className="w-full border border-gray-400 focus:border-black p-2 rounded outline-none text-black"
        rows={3}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Write a note..."
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded transition duration-200 hover:bg-blue-600 hover:scale-105"
      >
        Add Note
      </button>

      <div className="space-y-4 mt-4">
        {notes.map((note) => (
          <div key={note._id} className="bg-white shadow p-4 rounded">
            {editId === note._id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="w-full border border-gray-400 p-2 rounded text-black"
                  rows={2}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSave(note._id)}
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
              </div>
            ) : (
              <>
                <p className="text-black">{note.content}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-sm text-blue-600 underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-sm text-red-600 underline"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleSummarize(note)}
                    className="text-sm text-blue-600 underline"
                  >
                    Summarize with AI
                  </button>
                </div>
                {summaries[note._id] && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-700">
                    <strong>Summary:</strong> {summaries[note._id]}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
