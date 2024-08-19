import 'bootstrap/dist/css/bootstrap.css';
import './styles.css';
import React, { useState, useEffect } from 'react';
import raw from "./host.txt";
import { BrowserRouter, useLocation } from "react-router-dom";

import MyRouter from './MyRouter.jsx';

const SocialLinks = () => {
  const location = useLocation();
  const shouldRenderSocials = ! location.pathname.includes('/projects/');

  return shouldRenderSocials ? (
    <div id='socials'>
      <a className='social' href="https://github.com/peterb2396" target="_blank" rel="noreferrer">
        <img src="github.png" width="30px" alt="github" />
      </a>
      <a className='social' href="https://www.instagram.com/built.by.peter/" target="_blank" rel="noreferrer">
        <img src="insta.png" width="30px" alt="instagram" />
      </a>
    </div>
  ) : null;
};

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes("/projects/"))
      window.scrollTo(0, 0);
  }, [pathname]);

  return null; // This component doesn't render anything
};

const Main = () => {
  const [host, setHost] = useState("");

  // Set the background globally
  useEffect(() => {
    document.body.style.background = '#f0f0f0';
  }, []);

  // Get host from text file
  useEffect(() => {
    fetch(raw)
      .then(r => r.text())
      .then(text => {
        const copy = text.trim();
        setHost(copy);
      });
  }, []);

  // Store username and id locally
  const setToken = (username, id) => {
    localStorage.setItem('username', username);
    if (id) {
      localStorage.setItem('id', id);
    }
  };

  // Get token: Returns the username token
  const getToken = () => {
    return localStorage.getItem('username');
  };

  if (!host) return null;

  return (
    <BrowserRouter>
      <div>
      <ScrollToTopOnRouteChange />
        <MyRouter host={host} getToken={getToken} setToken={setToken} />
        <SocialLinks /> {/* Render social links based on pathname */}
      </div>
    </BrowserRouter>
  );
};

export default Main;
