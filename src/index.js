import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import Modal from 'react-modal';
import App from './App';
import { UserProvider } from './contexts/user.context'
import { PostsProvider } from './contexts/posts.context'


// Set the App element for accessibility
Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <PostsProvider>          
          <App />          
        </PostsProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);

