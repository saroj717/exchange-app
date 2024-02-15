import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Exchange from './Exchange';
import './App.css';

const App = () => {
  return (
    <div className="container mt-5">
      <nav className="navbar bg-secondary border-bottom border-body mt-3" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand mx-auto" href="#"><h1>Exchange App</h1></a>
        </div>
      </nav>
      <Exchange />
    </div>
  )
}

export default App;