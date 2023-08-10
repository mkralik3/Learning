import { useEffect, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import useFetch2 from "../hooks/useFetch2";

const Update = () => {
    const titleRef = useRef()
    const bodyRef = useRef()
    const authorRef = useRef()

    const { id } = useParams()
    const navigate = useNavigate();
    const { data: blog, executeFetch, error, isPending } = useFetch2('http://localhost:8000/blogs/' + id);

    // load blog during generationg page
    useEffect(() => {
        executeFetch();
    }, [executeFetch])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const updatedBlog = { title: titleRef.current.value, body: bodyRef.current.value, author: authorRef.current.value, id: blog.id }
        await executeFetch({
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBlog)
        }).then(response => {
            console.log("Blog with id" + id + " was updated!")
            navigate('/');
        })
    }

    return (
        <div className="update">
            {error && <div>{error}</div>}
            {isPending && <Loading />}
            {blog && (
                <div className="custom-form">
                    <h2>Update blog</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Blog title:</label>
                        <input
                            type="text"
                            required
                            ref={titleRef}
                            defaultValue={blog.title}
                        // value={title}
                        // onChange={(e) => setTitle(e.target.value)}

                        />
                        <label>Blog body:</label>
                        <textarea
                            type="text"
                            required
                            ref={bodyRef}
                            defaultValue={blog.body}
                        // value={body}
                        // onChange={(e) => setBody(e.target.value)}
                        />
                        <label>Blog author:</label>
                        <select
                            defaultValue={blog.author}
                            ref={authorRef}
                        // onChange={(e) => setAuthor(e.target.value)}
                        >
                            <option value="mario">mario</option>
                            <option value="yoshi">yoshi</option>
                        </select>
                        {!isPending && <button>Update blog</button>}
                        {isPending && <button disabled>Updating blog...</button>}
                    </form>
                </div>
            )}
        </div >
    );
}

export default Update;
