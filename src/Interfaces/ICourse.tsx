export interface ISubject {
    code: number;
    name: string;
    completed: boolean;
    grade?: number;
}

export interface ICourse {
    code: number;
    name: string;
    university: string;
    concluded: boolean;
    subjects?: ISubject[];
}