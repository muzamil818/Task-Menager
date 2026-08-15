import BoardTitle from "./BoardTitle";
import BoardColumn from "./BoardColumn";
import { type BoardColumnData } from "../../../type";

interface BoardProps {
    columns: BoardColumnData[];
    onAddCard?: (columnId: string | number, title: string) => void;
    onUpdateCard?: (columnId: string | number, taskId: string | number, title: string) => void;
    onDeleteCard?: (columnId: string | number, taskId: string | number) => void;
}

const Board = ({ columns, onAddCard, onUpdateCard, onDeleteCard }: BoardProps) => {

    return (
        <div className="h-full w-full bg-gradient-to-br from-purple-600 via-purple-700 to-pink-400 rounded flex flex-col min-h-0">
            <BoardTitle title="Board Title" />

            <div className="flex-1 min-h-0 overflow-x-auto p-4">
                <div className="flex gap-4 h-full min-w-max">
                    {columns.map((column) => (
                        <BoardColumn
                            key={column.id}
                            column={column}
                            onAddTask={onAddCard || (() => { })}
                            onUpdateTask={onUpdateCard || (() => { })}
                            onDeleteTask={onDeleteCard || (() => { })}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;
