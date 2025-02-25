import { useState } from "react";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the props type for the DiaryInputComponent.
type DiaryInputProps = {
    onAdd: (newEntryText: string) => void;
};

// Child component to DiaryComponent.
// This component is a text area and a button that allows the user to add a new entry to the diary.
// The onAdd function is called when the button is clicked, which passes the new entry text to the parent component.
export function DiaryInputComponent({ onAdd }: DiaryInputProps) {
    const [entryText, setEntryText] = useState<string>("");

    const doOnClick = () => {
        try {
            onAdd(entryText);
            setEntryText("");
        }
        catch (error) {
            console.error("Failed to add entry: ", error);
        }
    }

    return (
        <div className="mb-4">
            <h2 className="text-center mb-3">What's on your mind?</h2>
            <textarea
                className="form-control mb-3"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                rows={4}
            />
            <Button
                variant="primary"
                onClick={doOnClick}
                disabled={!entryText.trim()}
            >
                Post!
            </Button>
        </div>
    );
}