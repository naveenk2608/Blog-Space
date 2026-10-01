import { useEffect, useState } from 'react';
import './styles/StatusMessage.css';

// Centered message for a page or section that is empty or failed to load,
// with an optional action such as a link or a "Try again" button
const StatusMessage = ({ variant = 'info', title, message, action }) => (
  <div className={`status-message status-message--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
    {title && <h2 className="status-message-title">{title}</h2>}
    {message && <p className="status-message-text">{message}</p>}
    {action && <div className="status-message-action">{action}</div>}
  </div>
);

// Loading state that explains the wait when the server is slow to respond
// (the free-tier backend can take up to a minute to wake up)
export const LoadingMessage = ({ message = 'Loading...' }) => {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="status-message status-message--loading" role="status">
      <div className="status-spinner" aria-hidden="true" />
      <p className="status-message-text">{message}</p>
      {slow && (
        <p className="status-message-hint">
          The server may be waking up. This can take up to a minute.
        </p>
      )}
    </div>
  );
};

export default StatusMessage;
