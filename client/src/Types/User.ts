import { IGroup } from "./Group";

export type IUser=
{
    id:string,
    name:string,
    username:string,
    email:string,
    age:number,
    onboarded?:boolean,
    badges?: string[];
    groups?: IGroup[];
    lists?:string[],
    directors?:string[],
    actors?:string[],


}