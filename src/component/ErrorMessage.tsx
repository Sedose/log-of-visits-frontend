import React from 'react';
import { Alert } from 'reactstrap';

interface ErrorMessageProps {
  debug: string;
  message: string;
}

export default ({ debug, message } : ErrorMessageProps) => (
  <Alert color="danger">
    <p className="mb-3">{message}</p>
    {debug && <pre className="alert-pre border bg-light p-2"><code>{debug}</code></pre>}
  </Alert>
);
