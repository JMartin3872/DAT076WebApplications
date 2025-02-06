export interface Diary {
    id: number;
    title: string;
    entries: Entry[];
}

export interface Entry {
    id: number;
    title: string;
    date: number;
    text: string;
}


const minDagbok : Diary = {
    id: 1,
    title: "Midsommar 2021",
    entries: []
}

console.log(minDagbok);