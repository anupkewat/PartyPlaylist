  // App.js
  import React from 'react';
  import Button from './components/Button';
  import Dashboard from './components/Dashboard';
  import Login from './components/Login';
  import JoinPartyForm from './components/JoinPartyForm';
  import "bootstrap/dist/css/bootstrap.min.css"
  import JoinDashboard from './components/JoinDashboard';
  import { useState } from 'react'
  import {BrowserRouter as Router, Route , Switch} from 'react-router-dom'
  const code = new URLSearchParams(window.location.search).get('code')

  function App() {
    const [createParty , setCreateParty] = useState(false)
  

    
    return (

      <Router>
    <div className="base-style" >
      {/* <div className='flexy'>  <p className='title-style'>Party Playlist </p></div> */}

      <div className='flexy'>
          <Switch>
            <Route path='/login'>
            { code ? <Dashboard code={code} /> : <Login />}
              <Button onClick={() => window.location.href = 'https://party-playlist-2zfdsvzf8-anupkewats-projects.vercel.app/'} text={'go back'} />
            </Route>

            <Route path='/join'>
          <JoinDashboard />
            
              <Button onClick={() => window.location.href = 'https://party-playlist-2zfdsvzf8-anupkewats-projects.vercel.app/'} text={'go back'} />
            </Route>
            
            <Route path='/'>
              <Button onClick={() => window.location.href = 'https://party-playlist-2zfdsvzf8-anupkewats-projects.vercel.app/login'} text={'Start Party'} />
              <Button onClick={() => window.location.href = 'https://party-playlist-2zfdsvzf8-anupkewats-projects.vercel.app/join'} text={'Join Party'} />
            </Route>
          </Switch>
      </div>
    </div>
  </Router>

 
      

    );
  }
  const title_style = {
    color: '#e8e8e8',
    fontWeight: 900,
    fontSize: '12vw',
    fontFamily: 'Montserrat,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"!important',
  };

  export default App;
