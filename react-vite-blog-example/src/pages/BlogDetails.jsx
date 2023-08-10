import { useEffect } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import useFetch2 from "../hooks/useFetch2";

const BlogDetails = () => {

    const { id } = useParams()
    const { data: blog, executeFetch, error, isPending } = useFetch2('http://localhost:8000/blogs/' + id);
    const navigate = useNavigate()

    // load blog during generationg page
    useEffect(() => {
        executeFetch({ method: 'GET' })
    }, [executeFetch])

    const handleDeleteClick = async () => {
        await executeFetch({ method: 'DELETE' })
            .then(response => {
                console.log("Blog with id" + id + " was deleted!")
                navigate('/');
            })
    }

    return (
        <div className="blog-details">

            {error && <div>{error}</div>}
            {isPending && <Loading />}
            {blog && (
                <article>
                    <h2>{blog.title}</h2>
                    <p>Written by {blog.author}</p>
                    <div>{blog.body}</div>
                    <button>
                        <Link to={`/update/${blog.id}`} style={{
                            color: "white",
                            backgroundColor: "#f1356d",
                            borderRadius: '8px',
                            textDecoration: "none"
                        }}>Update</Link>
                    </button>
                    <button onClick={handleDeleteClick}>Delete</button>
                </article>
            )}


        </div>
    );
}

export default BlogDetails;