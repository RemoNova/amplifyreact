import React from 'react';
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import logo from './logo.svg';
import Notes from './Notes';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome in notes app</h1>
      </header>

      <div className="container">
        <Notes />
      </div>
      <div className="fotter">
        <AmplifySignOut />
      </div>
    </div>
  );
}

export default withAuthenticator(App);
