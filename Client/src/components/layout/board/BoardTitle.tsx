import { Filter, Share2 } from "lucide-react";
import profile from "../../../assets/profile-placeholder.jpeg";

interface BoardTitleProps {
    title: string;
}

const BoardTitle = ({ title }: BoardTitleProps) => {
    return (
        <div className="flex items-center justify-between px-4 h-12 bg-[#20183b91] text-white">
            <h1 className="text-white text-2xl font-bold">{title}</h1>

            <div className="flex items-center gap-3">
                <img src={profile} alt="profile" className="w-6 cursor-pointer  h-6 rounded-full" />

                <button
                    type="button"
                    className="flex items-center cursor-pointer gap-2 bg-white text-gray-800 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                    <Share2 className="w-4 h-4 cursor-pointer" />
                    Share
                </button>

                <button
                    type="button"
                    className="flex items-center cursor-pointer justify-center bg-white text-gray-800 rounded-md p-1.5 hover:bg-gray-100 transition-colors"
                    aria-label="Filter"
                >
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default BoardTitle;
