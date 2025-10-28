import React, { useEffect, useState } from 'react';
import { LastFmTrack } from '../api/types';
import { getTopTracks } from '../api/api';
import TrackItem from './TrackItem';

export default function TracksGrid() {
  const [tracks, setTracks] = useState<LastFmTrack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTracks = async () => {
      try {
        setLoading(true);
        setError(null);
        const tracksData = await getTopTracks(18);
        setTracks(tracksData);
      } catch (err) {
        console.error('Error loading tracks:', err);
        setError('Failed to load tracks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTracks();
  }, []);

  if (loading) {
    return <div className="tracks-grid">Loading tracks...</div>;
  }

  if (error) {
    return <div className="tracks-grid">{error}</div>;
  }

  return (
    <div className="tracks-grid">
      {tracks.map((track, index) => (
        <TrackItem key={`${track.mbid || track.name}-${track.artist.name}-${index}`} track={track} />
      ))}
    </div>
  );
}