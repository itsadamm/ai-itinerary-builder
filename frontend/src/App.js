import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";


function App() {

  // Test CORS connection to flask
  const [message, setMessage] = useState("")
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/tests")
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("API error:", err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Message from API: {message}</p>
      </header>
    </div>
  );
}

export default App;
