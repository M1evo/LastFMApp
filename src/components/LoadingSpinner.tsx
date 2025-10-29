import React from 'react';

interface LoadingSpinnerProps {
  /** Текст сообщения о загрузке */
  message?: string;
}

/**
 * Компонент отображения индикатора загрузки
 * @param {LoadingSpinnerProps} props Свойства компонента
 * @returns {JSX.Element} Элемент с индикатором загрузки
 */
export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps): JSX.Element {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}