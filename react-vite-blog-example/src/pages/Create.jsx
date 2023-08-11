import { useNavigate } from "react-router-dom";
import BlogForm from "../components/Form";
import useFetch2 from "../hooks/useFetch2";

const Create = () => {

    const navigate = useNavigate();

    const { executeFetch, isPending } = useFetch2('http://localhost:8000/blogs');

    const handleSubmit = async (e, formBlogTitle, formBlogBody, formBlogAuthor) => {
        e.preventDefault()
        const blog = { title: formBlogTitle.current.value, body: formBlogBody.current.value, author: formBlogAuthor.current.value }
        await executeFetch({
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog)
        }).then(response => {
            console.log("New blog was added")
            navigate('/')
        })
    }

    return (
        <div className="create">
            <BlogForm method="Add" submitHandler={handleSubmit} isPending={isPending} />
        </div >
    );
}

export default Create;
