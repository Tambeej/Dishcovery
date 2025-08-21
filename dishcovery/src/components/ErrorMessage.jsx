//  Error display.
import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 text-red-700 p-4 rounded">
      {message}
    </div>
  );
}

export default ErrorMessage;
