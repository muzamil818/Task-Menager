import { useState } from "react";
import BoardTitle from "./BoardTitle";
import BoardColumn, { type BoardColumnData } from "./BoardColumn";

const INITIAL_COLUMNS: BoardColumnData[] = [
    { id: 1, title: "Today", tasks: [] },
    { id: 2, title: "Tomorrow", tasks: [] },
    { id: 3, title: "This Week", tasks: [] },
];

const Board = () => {
    const [columns, setColumns] = useState<BoardColumnData[]>(INITIAL_COLUMNS);

    const handleAddTask = (columnId: number, title: string) => {
        setColumns((prev) =>
            prev.map((column) =>
                column.id === columnId
                    ? {
                          ...column,
                          tasks: [...column.tasks, { id: Date.now(), title }],
                      }
                    : column
            )
        );
    };

    const handleUpdateTask = (columnId: number, taskId: number, title: string) => {
        setColumns((prev) =>
            prev.map((column) =>
                column.id === columnId
                    ? {
                          ...column,
                          tasks: column.tasks.map((task) =>
                              task.id === taskId ? { ...task, title } : task
                          ),
                      }
                    : column
            )
        );
    };

    const handleDeleteTask = (columnId: number, taskId: number) => {
        setColumns((prev) =>
            prev.map((column) =>
                column.id === columnId
                    ? {
                          ...column,
                          tasks: column.tasks.filter((task) => task.id !== taskId),
                      }
                    : column
            )
        );
    };

    return (
        <div className="h-full w-full bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded flex flex-col min-h-0">
            <BoardTitle title="Board Title" />

            <div className="flex-1 min-h-0 overflow-x-auto p-4">
                <div className="flex gap-4 h-full min-w-max">
                    {columns.map((column) => (
                        <BoardColumn
                            key={column.id}
                            column={column}
                            onAddTask={handleAddTask}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Board;
