import { useEffect, useState } from "react";


// This is original useFetch from tutorial
// Do not use! replaced by useFetch2
const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();

        setTimeout(() => {
            console.log("use effect run")
            fetch(url, {signal: abortCont.signal})
                .then(res => {
                    if (!res.ok) {
                        throw Error('Could not fetch the data for that resource')
                    }
                    return res.json()
                })
                .then(responseData => {
                    setData(responseData)
                    setIsPending(false)
                    setError(null)
                })
                .catch(err => {
                    if (err.name === 'AbortError') {
                        console.log('fetch aborted')
                    } else {
                        setIsPending(false)
                        setError(err.message)
                    }
                })
        }, 1000); // simulate slow server

        return () => abortCont.abort()
    }, [url])

    return { data, isPending, error }
}

export default useFetch;