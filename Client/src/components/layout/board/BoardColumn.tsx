import EditableField from "../inbox/EditableField";
import BoardTask from "./BoardTask";

export interface BoardTaskItem {
    id: number;
    title: string;
}

export interface BoardColumnData {
    id: number;
    title: string;
    tasks: BoardTaskItem[];
}

interface BoardColumnProps {
    column: BoardColumnData;
    onAddTask: (columnId: number, title: string) => void;
    onUpdateTask: (columnId: number, taskId: number, title: string) => void;
    onDeleteTask: (columnId: number, taskId: number) => void;
}

const BoardColumn = ({
    column,
    onAddTask,
    onUpdateTask,
    onDeleteTask,
}: BoardColumnProps) => {
    return (
        <div className="w-72 shrink-0 flex flex-col max-h-full bg-[#20183b91] rounded-lg">
            <div className="px-4 py-3 border-b border-white/10">
                <h2 className="text-white font-semibold text-sm uppercase tracking-wide">
                    {column.title}
                </h2>
            </div>

            <div className="flex flex-col gap-2 p-3 overflow-y-auto flex-1 min-h-0">
                {column.tasks.map((task) => (
                    <BoardTask
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        onUpdate={(taskId, title) => onUpdateTask(column.id, taskId, title)}
                        onDelete={(taskId) => onDeleteTask(column.id, taskId)}
                    />
                ))}
                <EditableField
                    onSave={(title) => onAddTask(column.id, title)}
                    placeholder="Add task"
                />
            </div>
        </div>
    );
};

export default BoardColumn;
