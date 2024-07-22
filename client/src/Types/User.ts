import { IGroup } from "./Group";

export type IUser=
{
    id:string,
    name:string,
    age:number,
    badges?:[],
    groups?:IGroup[
    ],
    lists?:[],
    directors?:[],
    actors:[],

}