// Interface representing a diary
export interface Diary {
    // Variables for diary title and a list of entries
    id: number;
    title: string;
    owner: string;
    entries: Entry[];
}

// Interface representing one entry in a diary
export interface Entry {
    // The id of the diary in which entry belongs
    diaryId: number;
    // Entry id, should they be unique by themselves or in combination with diary id?
    id: number;
    // The entry text
    text: string;
    // The time the entry was created represented as a number from Date.now()
    time: number;
}