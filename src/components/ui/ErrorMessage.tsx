'use client';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <div
        className="w-16 h-16 mb-6 flex items-center justify-center rounded-full border"
        style={{ borderColor: '#C9A84C' }}
      >
        <svg width="24" height="24" fill="none" stroke="#C9A84C" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3
        className="text-xl mb-3"
        style={{ fontFamily: 'Playfair Display, serif', color: '#fff' }}
      >
        Something went wrong
      </h3>
      <p className="text-sm mb-8 max-w-sm" style={{ color: '#888' }}>
        {message || 'Unable to load content. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-luxury">
          Try Again
        </button>
      )}
    </div>
  );
}
