import React from 'react';
import logo from './logo.svg';
import Books from './Books'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello my friends</h1>
        <Books/>
      </header>
    </div>
  );
}

export default App;
