// Interface representing a diary
export interface Diary {
    //Variables for diary title and a list of entries
    title: string;
    entries: Entry[];
}

// Interface representing one entry in a diary
export interface Entry {
    id: number;
    date: number;
    text: string;
}