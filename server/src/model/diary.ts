// Interface representing a diary
export interface Diary {
    // The id of the diary
    id: number;
    // The title of the diary
    title: string;
    // The user who created the diary
    owner: string;
    // The list of entries in a diary
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
    // Indicates if an entry is pinned or not
    pinned: boolean;
    // The time the entry was created represented as a number from Date.now()
    time: number;
}