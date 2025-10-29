import React from 'react';

interface ErrorMessageProps {
  /** Основное сообщение об ошибке */
  message: string;
  /** Дополнительная подсказка для пользователя */
  hint?: string;
  /** Функция повторной попытки */
  onRetry?: () => void;
}

/**
 * Компонент отображения сообщения об ошибке с возможностью повтора
 * @param {ErrorMessageProps} props Свойства компонента
 * @returns {JSX.Element} Элемент с сообщением об ошибке
 */
export default function ErrorMessage({ 
  message, 
  hint = 'Please check your internet connection and try again.',
  onRetry 
}: ErrorMessageProps): JSX.Element {
  return (
    <div className="error-container" role="alert" aria-live="assertive">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      <p className="error-hint">{hint}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry-button">
          Try Again
        </button>
      )}
    </div>
  );
}