import React, { useEffect, useState } from "react";
import { KEYS, store } from "../../utils/storage.js";

export default function NotesTool() {
  const [notes, setNotes] = useState(() => store.get(KEYS.NOTES, ""));
  useEffect(() => {
    const t = setTimeout(() => store.set(KEYS.NOTES, notes), 200);
    return () => clearTimeout(t);
  }, [notes]);

  return (
    <div className="panel tool" id="tool-notes">
      <h3>Quick Notes</h3>
      <label htmlFor="notesArea">Your notes (autosave)</label>
      <textarea
        id="notesArea"
        placeholder="Jot something down…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div className="row">
        <span className="small muted">Saved locally</span>
        <span className="small right" id="notesCount">
          {notes.length} chars
        </span>
      </div>
    </div>
  );
}