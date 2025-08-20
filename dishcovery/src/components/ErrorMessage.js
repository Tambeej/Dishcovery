import React from 'react';

const ErrorMessage = ({ message }) => (
  <div className="bg-red-100 text-red-700 p-4 rounded">
    {message}
  </div>
);

export default ErrorMessage;