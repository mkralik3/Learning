
import { ThreeDots } from "react-loader-spinner";

const Loading = () => {
    return (
        <div className="loading-div">
            <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="#f1356d"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
            />
        </div>
    );
}
export default Loading;