/**
 * Notes:
 * 
 * Welcome page should have text as main content, more resume style. Clean up the left side with bullet points
 * Page for video games (chicken duty, insider)
 * Page for applications (biggest loser, iphone app, 3D model app)
 * Page for web projects (doc xtract!): Video demo, brief introduction paragraph, then get technical (for all pages)
 */

import Welcome from './Components/Welcome.jsx'
import Inventory from "./Components/Inventory.jsx";
import Login from "./Components/Login.jsx";
import Account from './Components/Account.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import React, {useState} from 'react';
import raw from "./host.txt"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from './Components/Nav.jsx';
import Projects from './Components/Projects.jsx';
import ContactForm from './Components/ContactForm.jsx';


const Main = () => {
  const [host, setHost] = useState("")
  // get host from text file
fetch(raw)
 .then(r => r.text())
 .then(text => {
  var copy = (' ' + text).slice(1);
  setHost(copy)
});

  function setToken(userToken) {
    // Store the username as a token to display and allow logged-in-features
    sessionStorage.setItem('token', userToken);
  }
  
  function getToken() {
    return sessionStorage.getItem('token');
  }


   
  if (host)
    return (
      <>
    {/* Navbar section */}
    
    <BrowserRouter>
    <Nav token = {getToken}></Nav>
      <Routes>
          <Route index element={<Welcome token = {getToken} host = {host}/>} />
          <Route path="inventory" element={<Inventory token = {getToken} host = {host} />} />
          <Route path="login" element={<Login setToken = {setToken} token = {getToken} host = {host}/>} />
          <Route path="account" element={<Account setToken = {setToken} token = {getToken} host = {host}/>} />
          <Route path="contact" element={<ContactForm host = {host}/>} />
          <Route path="projects" element={<Projects host = {host}/>} />
          <Route path="projects/:projectId" element={<Projects host = {host} project = {JSON.parse(sessionStorage.getItem('project'))}/>} />
      </Routes>
    </BrowserRouter>
    <div id = 'socials'>
      <hr></hr>
      <a href="https://github.com/peterb2396" target="_blank" rel="noreferrer">
        <img src="github.png"  width = "30px"alt = "github"></img>
      </a>
    </div>
    </>
  

    )

}

export default Main;