import { Inbox, Filter, MoreHorizontal } from "lucide-react";

const InboxCard = () => {
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
        </div>
    )
}

export default InboxCard