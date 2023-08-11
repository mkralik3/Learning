import { useRef } from "react";
import Loading from "../components/Loading";


const BlogForm = ({ title = "", body = "", author = "", submitHandler, method, isPending }) => {
    const formBlogTitle = useRef()
    const formBlogBody = useRef()
    const formBlogAuthor = useRef()

    return (
        <div className="custom-form">
            <h2>{method} a NewBlog</h2>
            <form onSubmit={(e) => submitHandler(e, formBlogTitle, formBlogBody, formBlogAuthor)}>
                <label>Blog title:</label>
                <input
                    required
                    ref={formBlogTitle}
                    defaultValue={title}
                // onChange={(e) => setTitle(e.target.value)}

                />
                <label>Blog body:</label>
                <textarea
                    required
                    ref={formBlogBody}
                    defaultValue={body}
                // value={body}
                // onChange={(e) => setBody(e.target.value)}
                />
                <label>Blog author:</label>
                <select
                    defaultValue={author}
                    ref={formBlogAuthor}
                // value={author}
                // onChange={(e) => setAuthor(e.target.value)}
                >
                    <option value="mario">mario</option>
                    <option value="yoshi">yoshi</option>
                </select>
                {!isPending && <button>{method} blog</button>}
                {isPending && <Loading></Loading>}
            </form>
        </div>
    );
}

export default BlogForm;