import React, { useEffect, useState } from 'react';
import { LastFmArtist } from '../api/types';
import { getTopArtists } from '../api/api';
import ArtistCard from './ArtistCard';

export default function ArtistsGrid() {
  const [artists, setArtists] = useState<LastFmArtist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true);
        setError(null);
        const artistsData = await getTopArtists(12);
        setArtists(artistsData);
      } catch (err) {
        console.error('Error loading artists:', err);
        setError('Failed to load artists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  if (loading) {
    return <div className="artists-grid">Loading artists...</div>;
  }

  if (error) {
    return <div className="artists-grid">{error}</div>;
  }

  return (
    <div className="artists-grid">
      {artists.map((artist, index) => (
        <ArtistCard key={`${artist.mbid || artist.name}-${index}`} artist={artist} />
      ))}
    </div>
  );
}