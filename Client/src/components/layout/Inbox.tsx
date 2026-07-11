import { Inbox, Filter, MoreHorizontal } from "lucide-react";
import AddCardBtn from "./AddCardBtn";
import TaskCards from "./TaskCards";
const InboxPortion = () => {
    return (
        <div className="h-[70vh] w-[25vw] bg-[hsl(222,49%,20%)] rounded ml-4 my-auto">
            <div className="flex justify-between items-center px-4 h-[70px] w-full bg-[#142741] rounded">
                <div className="flex items-center gap-2">
                    <Inbox className="text-white w-5 h-5" />
                    <h1 className="text-white">Inbox</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="text-white w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
                    <MoreHorizontal className="text-white w-5 h-5 cursor-pointer hover:text-blue-400 transition-colors" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 py-2">
                <AddCardBtn />
                <TaskCards />
            </div>
        </div>
    )
}

export default InboxPortion