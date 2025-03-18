import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

// Define the props type for the DiaryInputComponent.
type DiaryInputProps = {
    onAdd: (newEntryText: string) => void;
};

// Child component of DiaryComponent.
// This component is a text area and a button that allows the user to add a new entry to the diary.
// The onAdd function is called when the button is clicked, which passes the new entry text to the parent component.
export function DiaryInputComponent({ onAdd }: DiaryInputProps) {
    const [entryText, setEntryText] = useState<string>("");
    const statusMessageRef = useRef<HTMLParagraphElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    // Function to handle adding a new entry to the diary.
    const doOnClick = () => {
        try {
            onAdd(entryText);
            setEntryText("");
        }
        catch (error) {
            console.error("Failed to add entry: ", error);
        }
    }

    // Handle the enter key press to add a new entry.
    const pressEnterPost = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && entryText.trim()) {
            e.preventDefault();
            doOnClick();
        }
    }

    return (
        <div className="mb-4">
            <h2 className="text-center mb-3" tabIndex={0}>What's on your mind?</h2>
            <textarea
                ref={inputRef}
                className="form-control mb-3"
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                onKeyDown={pressEnterPost}
                rows={4}
                aria-label="Write your diary entry here"
                aria-required="true"
            />
            <Button
                variant="success"
                onClick={doOnClick}
                disabled={!entryText.trim()}
                aria-label="Post your diary entry"
            >
                Post!
            </Button>
            {/* Screen reader-friendly success message */}
            <p
                ref={statusMessageRef}
                aria-live="polite"
                className="visually-hidden"
            >
                {entryText ? "Entry added successfully!" : ""}
            </p>
        </div>
    );
}