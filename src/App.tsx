import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Music from './pages/music/Music';
import Search from './pages/search/Search';

/**
 * Корневой компонент приложения с роутингом
 * @returns {JSX.Element} Приложение
 */
function App(): JSX.Element {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Music />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Layout>
  );
}

export default App;