import React, { useEffect, useState } from "react";
import { KEYS, store } from "../utils/storage.js";

export default function Footer() {
  const [name, setName] = useState("Your Name");
  useEffect(() => {
    const hero = store.get(KEYS.CREATER, null);
    setName(hero?.name || "Your Name");
  }, []);
  return (
    <footer className="container center">
      <div className="divider"></div>
      <p>
        © <span>{new Date().getFullYear()}</span> <span>{name}</span>. All rights reserved.
      </p>
      <p className="small">Your content is saved in your browser storage. Clearing site data will reset it.</p>
    </footer>
  );
}