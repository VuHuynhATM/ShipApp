import { Order } from "./order";

export interface Reponse {
    success?:boolean;
    message?:string;
    data?:Order[];
}