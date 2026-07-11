// import { Plus } from "lucide-react";
const AddCardBtn = () => {
    return (
        <div className="flex justify-center items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors">
            <span className="w-[20vw] bg-[#111827] py-2 px-4 items-center  rounded flex flex-start gap-2">
                {/* <Plus className="text-gray-500 w-5 h-5" /> */}
                <span className="text-gray-500 ">Add card</span>
            </span>
        </div>
    )
}

export default AddCardBtn
