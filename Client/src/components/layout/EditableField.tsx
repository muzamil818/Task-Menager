import { useState, type KeyboardEvent, type ChangeEvent } from "react";
import Btn from "./AddCardBtn";

interface EditableFieldProps {
    initialValue?: string;
    onSave?: (value: string) => void;
    multiline?: boolean;
    placeholder?: string;
}

function EditableField({
    initialValue = "",
    onSave,
    multiline = false,
    placeholder = "Click to edit",
}: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [value, setValue] = useState<string>(initialValue);
    const [draft, setDraft] = useState<string>(initialValue);

    const handleEditClick = () => {
        setDraft(value);
        setIsEditing(true);
    };

    const handleSave = () => {
        setValue(draft);
        setIsEditing(false);
        onSave?.(draft);
    };

    const handleCancel = () => {
        setDraft(value);
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
                {value || placeholder}
            </Btn>
        );
    }

    return (
        <>
            <div className="text-white w-[20vw] bg-[#111827] py-2 px-4 items-center  rounded flex flex-col gap-2">
                {multiline ? (
                    <textarea
                        value={draft}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-[20vw] bg-[#111827] py-2 px-4 items-center  rounded flex flex-start gap-2"
                    />
                ) : (
                    <input
                        type="text"
                        value={draft}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="w-[20vw] bg-[#111827] py-2 px-4 items-center  rounded flex flex-start gap-2"
                    />
                )}
            </div>
            <div className="flex gap-2 w-full">
                <Btn onClick={handleSave} className=" px-[25px] py-[9px]">Save</Btn>
                <Btn onClick={handleCancel} className=" px-[25px] py-[9px]">Cancel</Btn>
            </div>
        </>
    );
}

export default EditableField;