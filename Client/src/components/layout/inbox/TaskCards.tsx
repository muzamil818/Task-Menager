import EditableField from "./EditableField";

interface TaskCardProps {
    id: number;
    title: string;
    onUpdate: (id: number, title: string) => void;
    onDelete: (id: number) => void;
}

const TaskCards = ({ id, title, onUpdate, onDelete }: TaskCardProps) => {
    return (
        <EditableField
            value={title}
            onSave={(newTitle) => onUpdate(id, newTitle)}
            onDelete={() => onDelete(id)}
        />
    );
};

export default TaskCards;
