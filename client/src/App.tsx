import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Fib from './Fib';
import Result from './Result';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <h1>Welcome to React</h1>
          <Link to="/">Home</Link>
          <Link to="/result">Result</Link>
        </header>
        <div>
          <Routes>
            <Route path="/" element={<Fib />} />
            <Route path="result" element={<Result />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
