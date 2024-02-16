import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Exchange from './Exchange';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={ 
          <div className="container mt-5">
          <nav className="navbar bg-dark border-bottom border-body mt-3 rounded" data-bs-theme="dark">
            <div className="container-fluid">
              <a className="navbar-brand mx-auto" href="#"><h1>Currency Converter</h1></a>
            </div>
          </nav>
          <Exchange />
          </div>} 
        />   
      </Routes>
    </Router>
  )
}

export default App;