import {Component, useState} from "react";
import {Container, Row} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Diary, Entry, deleteEntryRequest } from "../api.ts";
import { EntryComponent } from "./entryComponent.tsx";



export function EntryListComponent(prop: {diary : Diary}) {

    const [diary, setDiary] = useState<Diary>(prop.diary);

    const deleteEntry = async (entryId: number) : Promise<void> =>{
        const newEntryList = await deleteEntryRequest(diary.owner, diary.id, entryId);

        if(!newEntryList){
    
        }
        else{
            
            const new_diary : Diary = {
                id : diary.id,
                owner : diary.owner,
                title : diary.title,
                nextEntryId : diary.nextEntryId,
                entries : newEntryList
            }
            
            setDiary(new_diary);
        }
    }

    const myEntryComponents = diary.entries.map(entry => 
        
            <EntryComponent myEntry={entry} onDelete={deleteEntry}/>
        );


    return(
        <>
            <div>
                <Row className="text-center">
                    <h2>Entries</h2>
                    
                </Row>  
                <Row>
                    <ul>{myEntryComponents}</ul>
                </Row>      
            </div>
        </>
    );
}