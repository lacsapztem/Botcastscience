import { useEffect, useState, EventSource } from 'react';
//React= require('react')

function useSSE(url) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const eventSource = new React.EventSource(url);

    // Handle incoming data
    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };

    // Handle errors
    eventSource.onerror = () => {
      setError('Connection lost. Trying to reconnect...');
      eventSource.close();
    };

    // Cleanup when component unmounts
    return () => eventSource.close();
  }, [url]);

  return { data, error };
}

export default useSSE;
