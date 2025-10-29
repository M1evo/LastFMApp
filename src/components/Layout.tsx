import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Компонент обёртки страницы с Header и Footer
 * @param {LayoutProps} props Свойства компонента
 * @returns {JSX.Element} Обёртка с шапкой и подвалом
 */
export default function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}