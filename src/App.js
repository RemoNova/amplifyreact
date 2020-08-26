import React from 'react';
import logo from './logo.svg';
import Books from './Books'
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Hello my friends</h1>
        <h1>We now have Auth!</h1>
        <Books/>
        <AmplifySignOut />
      </header>
    </div>
  );
}

export default withAuthenticator(App);
