import { useState } from "react";
import { Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

type DiaryInputProps = {
    onAdd: (newEntryText : string) => void;
};

export function DiaryInputComponent({ onAdd }: DiaryInputProps) {
    const [entryText, setEntryText] = useState<string>("");

    // const doOnClick = () => {
    //     setEntryText("");
    //     onAdd(entryText);
    // }

    //TODO uncomment this when working with backend.

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
        onClick={() => 
            onAdd(entryText)
        }
        disabled={!entryText.trim()}
        >
            Post!
        </Button>
    </div>
    );
}





// Old tries for a solution

// export function DiaryInputComponent(prop: {diary : Diary}) {
//     const [diary, setDiary] = useState<Diary>(prop.diary);

//     const [entryText, setEntryText] = useState<string>("");
//     const navigate = useNavigate();

//     const addEntry = async () : Promise <void> => {
//         const newEntryList = await addEntryRequest(diary.owner, diary.id, entryText)

//         if(!newEntryList){
//             console.log("Error in addEntry")
//         }
//         else {
//             const new_diary : Diary = {
//                 id : diary.id,
//                 owner : diary.owner,
//                 title : diary.title,
//                 nextEntryId : diary.nextEntryId,
//                 entries : newEntryList
//             }
//             setDiary(new_diary);
//             setEntryText("");
//             navigate("/diary/", {state: {diary: new_diary}});
//         }
//     }

//   //  const myEntryComponents = diary.entries.map(entry =>
//   //      <EntryComponent myEntry={entry} onDelete={addEntry}/>
//   //  );

//     return(
//         <>
//             <h2>What's on your mind?</h2>

//             <textarea
//                 value={entryText}
//                 onChange={(e) => setEntryText(e.target.value)}>
//             </textarea>

//             <Button variant="primary" type="button" onClick={addEntry}>
//                     Post!
//                 </Button>
//         </>

//     );
// }