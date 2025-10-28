import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Music from './music/Music';
import Search from './search/Search';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Music />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default App;