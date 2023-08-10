import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetch2 from "../hooks/useFetch2";

const Create = () => {
    // const [title, setTitle] = useState('');
    // const [body, setBody] = useState('');
    // const [author, setAuthor] = useState('mario');
    const titleRef = useRef()
    const bodyRef = useRef()
    const authorRef = useRef()

    const navigate = useNavigate();

    const { executeFetch, isPending } = useFetch2('http://localhost:8000/blogs');

    const handleSubmit = async (e) => {   
        e.preventDefault()
        const blog = { title: titleRef.current.value, body: bodyRef.current.value, author: authorRef.current.value }
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
            <div className="custom-form">
                <h2>Add a NewBlog</h2>
                <form onSubmit={handleSubmit}>
                    <label>Blog title:</label>
                    <input
                        type="text"
                        required
                        ref={titleRef}
                    // value={title}
                    // onChange={(e) => setTitle(e.target.value)}

                    />
                    <label>Blog body:</label>
                    <textarea
                        required
                        ref={bodyRef}
                    // value={body}
                    // onChange={(e) => setBody(e.target.value)}
                    />
                    <label>Blog author:</label>
                    <select
                        defaultValue={"yoshi"}
                        ref={authorRef}
                    // value={author}
                    // onChange={(e) => setAuthor(e.target.value)}
                    >
                        <option value="mario">mario</option>
                        <option value="yoshi">yoshi</option>
                    </select>
                    {!isPending && <button>Add blog</button>}
                    {isPending && <button disabled>Adding blog...</button>}

                </form>
            </div>
        </div >
    );
}

export default Create;
