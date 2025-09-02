"use client";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function NotesTab() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [summaries, setSummaries] = useState({}); // key: noteId
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axios
      .get("/api/notes")
      .then((res) => mounted && setNotes(res.data))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
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

  const filteredNotes = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter((n) => n.content.toLowerCase().includes(q));
  }, [notes, query]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-900">Your Notes</h2>
        <div className="text-sm text-gray-600">Total: {notes.length}</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
        <div className="sm:col-span-2">
          <textarea
            className="w-full border border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 p-2 rounded-md outline-none text-black"
            rows={3}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Write a note..."
          />
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md transition hover:bg-blue-700"
          >
            Add Note
          </button>
        </div>
        <div className="flex items-start">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-md border border-gray-200 p-6 text-center text-gray-600">
          Loading notes...
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="bg-white rounded-md border border-gray-200 p-6 text-center">
          <p className="text-gray-700 font-medium mb-1">No notes yet</p>
          <p className="text-sm text-gray-500">Start by writing something above.</p>
        </div>
      ) : (
        <div className="space-y-3 mt-2">
          {filteredNotes.map((note) => (
            <div key={note._id} className="bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition p-4 rounded-md">
              {editId === note._id ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full border border-gray-300 p-2 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(note._id)}
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
                </div>
              ) : (
                <>
                  <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-sm text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-sm text-red-700 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleSummarize(note)}
                      className="text-sm text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
                    >
                      Summarize with AI
                    </button>
                  </div>
                  {summaries[note._id] && (
                    <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                      <strong>Summary:</strong> {summaries[note._id]}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
