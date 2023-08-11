import { useEffect } from "react";

import { useNavigate, useParams } from "react-router-dom";
import BlogForm from "../components/Form";
import Loading from "../components/Loading";
import useFetch2 from "../hooks/useFetch2";

const Update = () => {
    const { id } = useParams()
    const navigate = useNavigate();
    const { data: blog, executeFetch, error, isPending } = useFetch2('http://localhost:8000/blogs/' + id);

    // load blog during generationg page
    useEffect(() => {
        executeFetch();
    }, [executeFetch])

    const handleSubmit = async (e, formBlogTitle, formBlogBody, formBlogAuthor) => {
        e.preventDefault()
        const updatedBlog = { title: formBlogTitle.current.value, body: formBlogBody.current.value, author: formBlogAuthor.current.value, id: blog.id }
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
                <BlogForm title={blog.title} body={blog.body} author={blog.author} method="Update" submitHandler={handleSubmit} isPending={isPending} />
            )}
        </div >
    );
}

export default Update;
