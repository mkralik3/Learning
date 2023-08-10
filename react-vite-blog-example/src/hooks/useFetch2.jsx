import { useState, useCallback } from "react";

const useFetch2 = url => {
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [data, setData] = useState(null);
  
    const executeFetch = useCallback(
      async (options) => {
        setIsPending(true);
        setError(null);
          return await fetch(url, options)
          .then(response => response.json())
          .then(response => {
            setData(response); 
            return response;
          })
          .catch(err => {
            setError(err.message)
            return err;
          })
          .finally(() => setIsPending(false));
      },
      [url, setIsPending, setError]
    );
    return { data, error, isPending, executeFetch }
  };

  export default useFetch2;