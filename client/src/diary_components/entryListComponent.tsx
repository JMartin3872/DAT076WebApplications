import {useEffect, useState} from "react";
import {Row, Col, Dropdown, Accordion} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary, Entry} from "../api.ts";
import { EntryComponent } from "./entryComponent.tsx";

type EntryListComponentProps = {
    mydiary : Diary;
    onEntryEdit: (id: number, editedText: string, pinned: boolean) => void;
    onEntryDelete: (id: number) => void;
    onTogglePin: (entry:Entry) => void;
};

export function EntryListComponent({mydiary, onEntryEdit, onEntryDelete, onTogglePin} : EntryListComponentProps) {

    const [diary, setDiary] = useState<Diary>(mydiary);
    const [sortByNewest, setSortByNewest] = useState<boolean>(true);

    useEffect(() => {
        setDiary(mydiary); // Update child state when parentValue changes
    }, [mydiary]);

    // Sort entries, newest first, and then create entry components from them.
    let sortedEntries : Entry[] = diary.entries;
    if(sortByNewest){
        sortedEntries = sortedEntries.sort((e1, e2) => e2.id - e1.id);
    }

    else{
        sortedEntries = sortedEntries.sort((e1, e2) => e1.id - e2.id);
    }

    const pinnedEntryComponents = sortedEntries.filter(entry => entry.pinned === true).map(entry => 
        <EntryComponent 
            key={entry.id} 
            myEntry={entry}
            onEdit={onEntryEdit} 
            onDelete={onEntryDelete}
            onTogglePin={onTogglePin}
        />
    );

    const allEntryComponents = sortedEntries.map(entry => 
        <EntryComponent 
            key={entry.id} 
            myEntry={entry}
            onEdit={onEntryEdit} 
            onDelete={onEntryDelete}
            onTogglePin={onTogglePin}
        />
    );

    const sortByNew = () => {
        setSortByNewest(true)
    }

    const sortByOld = () => {
        setSortByNewest(false)
    }

    // Don)t render if diary is missing or if diary doesn)t have any entries yet
    if (!diary || diary.entries.length === 0) return null;


    return(
        <>
            <div>
                <Row className="text-center mb-2">
                    <Col className="text-end">
                        <Dropdown> 
                            <Dropdown.Toggle variant="succcess" className="btn-sm">
                                Sort by:
                            </Dropdown.Toggle >

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={sortByNew}>
                                    Newest
                                </Dropdown.Item>

                                <Dropdown.Item onClick={sortByOld}>
                                    Oldest
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                    
                </Row>  
                <Row>
                    <Accordion>
                        <Accordion.Header>
                            Pinned entries
                        </Accordion.Header>

                        <Accordion.Body className="custom-accordion-body">
                            <ul>{pinnedEntryComponents}</ul>
                        </Accordion.Body>
                    </Accordion>

                    

                    
                </Row> 
                <Row>
                    <ul>{allEntryComponents}</ul>
                </Row>      
            </div>
        </>
    );
}