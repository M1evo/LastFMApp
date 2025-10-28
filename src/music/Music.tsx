import React from 'react';
import './music.css';
import Header from '../Header';
import Footer from '../Footer';
import ArtistsGrid from './ArtistsGrid';
import TracksGrid from './TracksGrid';

export default function Music() {
  return (
    <div id="root">
      <Header />
      <main className="main">
        <div className="container">
          <h1 className="page-title">Music</h1>
          <section>
            <h2 className="section-title">Hot right now</h2>
            <ArtistsGrid />
          </section>
          <section>
            <h2 className="section-title">Popular tracks</h2>
            <TracksGrid />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}