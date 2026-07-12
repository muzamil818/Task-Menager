interface TaskCardProps {
    title: string;
}

const TaskCards = ({ title }: TaskCardProps) => {
    return (
        <div className="w-[20vw] bg-[#111827] py-2 px-4 items-center cursor-pointer rounded">
            <div className="text-white">{title}</div>
        </div>
    );
};

export default TaskCards;
