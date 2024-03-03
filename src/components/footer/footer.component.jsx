import React from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInstagram } from "@fortawesome/free-brands-svg-icons"

import './footer.styles.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <span-footer>News Blog</span-footer>
        <span-footer>newsblog@gmail.com</span-footer>
        <span-footer>City</span-footer>
        <span-footer>@2024</span-footer>
      </div>
      <div className="footer-right">
        <a 
          href="" 
          target="_blank" 
          rel="noopener noreferrer">
          <FontAwesomeIcon className="fa-instagram" icon={faInstagram} /></a>    
      </div>
    </footer>
  );
};

export default Footer;