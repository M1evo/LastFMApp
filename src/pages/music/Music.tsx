import React from 'react';
import './music.css';
import ArtistsGrid from './ArtistsGrid';
import TracksGrid from './TracksGrid';

/**
 * Главная страница с популярными артистами и треками
 * @returns {JSX.Element} Страница Music
 */
export default function Music(): JSX.Element {
  return (
    <div className="page-container">
      <h1 className="page-heading">Music</h1>
      
      <section className="content-section" aria-labelledby="artists-heading">
        <h2 id="artists-heading" className="section-heading">
          Hot right now
        </h2>
        <ArtistsGrid />
      </section>
      
      <section className="content-section" aria-labelledby="tracks-heading">
        <h2 id="tracks-heading" className="section-heading">
          Popular tracks
        </h2>
        <TracksGrid />
      </section>
    </div>
  );
}