import { useEffect } from "react";

import BlogList from "../components/BlogList";
import Loading from "../components/Loading";
import useFetch2 from "../hooks/useFetch2";

const Home = () => {

    const { data: blogs, executeFetch, error, isPending } = useFetch2('http://localhost:8000/blogs/');

    // load all blogs
    useEffect(() => {
        executeFetch({ method: 'GET' });
    }, [executeFetch])

    return (
        <div className="home">
            {error && <div>{error}</div>}
            {isPending && <Loading />}
            {blogs && <BlogList blogs={blogs} title='All Blogs!' />}
        </div>
    );
}

export default Home;