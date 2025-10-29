import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo"></Link>
      </div>
      <div className="header-right">
        <Link to="/search" className="search-icon"></Link>
        <a href="#">Live</a>
        <Link to="/">Music</Link>
        <a href="#">Charts</a>
        <a href="#">Events</a>
        <a className="profile-icon" href="#"></a>
      </div>
    </header>
  );
}