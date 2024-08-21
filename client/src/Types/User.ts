import { Director } from "../pages/Onboard/(components)/TopDirectors";
import { IGroup } from "./Group";

export type IUser=
{
    id:string,
    username:string,
    profile_image: string,
    email:string,
    age:number,
    onboarded?:boolean,
    badges?: string[];
    groups?: IGroup[];
    lists?:string[],
    directors?:Director[],
    actors?:string[],


}