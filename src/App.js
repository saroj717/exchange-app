import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import './App.css';
import './Home.js'

const App = () => {
  return (
    <div class="container">
      <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
        <div class="container-fluid">
          <a class="navbar-brand mx-auto" href="#">Exchange App</a>
        </div>
      </nav>
      <Home />
    </div>
  )
}

export default App;