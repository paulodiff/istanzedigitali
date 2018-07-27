export interface Joke {
    id: number;
    joke: string;
    categories: Array<string>;
}



export interface JokeResponse {
    type: string;
    value: Array<Joke>;
}

export interface LookupObject {
    id: number;
    value: string;
}



export interface LookupResponse {
    type: string;
    value: Array<LookupObject>;
}
