import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import searchIcon from '../images/search.svg';

/**
 * Компонент шапки сайта с навигацией
 * @returns {JSX.Element} Header
 */
export default function Header(): JSX.Element {
  const location = useLocation();
  
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">Last.fm</Link>
        </div>
        <nav className="header-right">
          <Link to="/search" className="search-link">
            <img src={searchIcon} alt="Search" className="search-icon-img" />
          </Link>
          <a href="/" className="nav-link">Live</a>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'nav-link-active' : ''}`}
          >
            Music
          </Link>
          <a href="/" className="nav-link">Charts</a>
          <a href="/" className="nav-link">Events</a>
          <span className="profile-avatar" aria-label="User profile"></span>
        </nav>
      </div>
    </header>
  );
}