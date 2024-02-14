import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import './App.css';
import './Home.js'

const App = () => {
  return (
    <Router>
      <div className="container">
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
          <div className="container-fluid">
            <a className="navbar-brand mx-auto" href="#"><h2>Currency Converter</h2></a>
          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/" exact Component={Home} />
      </Routes>
    </Router>
  )
}

export default App;