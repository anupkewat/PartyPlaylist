// App.js
import React from 'react';
import Button from './components/Button';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import JoinPartyForm from './components/JoinPartyForm';
import "bootstrap/dist/css/bootstrap.min.css"
import { useState } from 'react'
import {BrowserRouter as Router, Route , Switch} from 'react-router-dom'
const code = new URLSearchParams(window.location.search).get('code')

function App() {
  const [createParty , setCreateParty] = useState(false)

  
  return (

    <Router>
  <div className="App" style={base_styles}>
    <Switch>
      <Route path='/login'>
      { code ? <Dashboard code={code} /> : <Login />}
        <Button onClick={() => window.location.href = 'http://localhost:3000/'} text={'go back'} />
      </Route>

      <Route path='/join'>
        <JoinPartyForm/>
        <Button onClick={() => window.location.href = 'http://localhost:3000/'} text={'go back'} />
      </Route>
      
      <Route path='/'>
        <Button onClick={() => window.location.href = 'http://localhost:3000/login'} text={'Start Party'} />
        <Button onClick={() => window.location.href = 'http://localhost:3000/join'} text={'Join Party'} />
      </Route>
    </Switch>
  </div>
</Router>

    
  

  );
}

const base_styles = { backgroundColor: '#5c5e5c', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }

export default App;
