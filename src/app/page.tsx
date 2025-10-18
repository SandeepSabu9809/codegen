// app/page.tsx
import React from "react";
import { HomePage } from "../components/HomePage";
import "./App.css"; // optional, but can be imported

export default function Page() {
  return (
    <div className="App">
      <HomePage />
    </div>
  );
}
