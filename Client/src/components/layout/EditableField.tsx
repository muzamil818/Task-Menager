import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import Btn from "./AddCardBtn";

interface EditableFieldProps {
    onSave?: (value: string) => void;
    multiline?: boolean;
    placeholder?: string;
}

function EditableField({
    onSave,
    multiline = false,
    placeholder = "Add card",
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [draft, setDraft] = useState<string>("");

    const handleEditClick = () => {
        setDraft("");
        setIsEditing(true);
    };

    const handleSave = () => {
        const trimmed = draft.trim();
        if (!trimmed) return;

        onSave?.(trimmed);
        setDraft("");
        setIsEditing(false);
    };

    const handleCancel = () => {
        setDraft("");
        setIsEditing(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDraft(e.target.value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !multiline) handleSave();
        if (e.key === "Escape") handleCancel();
    };

    if (!isEditing) {
        return (
            <Btn onClick={handleEditClick}>
                {placeholder}
            </Btn>
        );
    }

    return (
        <>
            <div className="text-white w-[20vw] bg-[#111827] py-2 px-4 items-center rounded flex flex-col gap-2">
                {multiline ? (
                    <textarea
                        value={draft}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-[20vw] bg-[#111827] py-2 px-4 items-center rounded flex flex-start gap-2"
                    />
                ) : (
                    <input
                        type="text"
                        value={draft}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-[20vw] bg-[#111827] py-2 px-4 items-center rounded flex flex-start gap-2"
                    />
                )}
            </div>
            <div className="flex gap-2 w-full">
                <Btn onClick={handleSave} className="px-[25px] py-[9px]">Save</Btn>
                <Btn onClick={handleCancel} className="px-[25px] py-[9px]">Cancel</Btn>
            </div>
        </>
    );
}

export default EditableField;
