import EditableField from "../inbox/EditableField";

interface BoardTaskProps {
    id: number;
    title: string;
    onUpdate: (taskId: number, title: string) => void;
    onDelete: (taskId: number) => void;
}

const BoardTask = ({ id, title, onUpdate, onDelete }: BoardTaskProps) => {
    return (
        <EditableField
            value={title}
            onSave={(newTitle) => onUpdate(id, newTitle)}
            onDelete={() => onDelete(id)}
        />
    );
};

export default BoardTask;
