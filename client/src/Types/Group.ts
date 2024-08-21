
import { IconType } from "react-icons";
import { IUser } from "./User";


export type IGroup=
{
    id:string,
    description?:string,
    icon:IconType,
    name?:string,
    members?:IUser[],
}