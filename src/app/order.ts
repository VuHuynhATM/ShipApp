export interface Order {
    orderID?:number;
    create_Date?:Date;
    orderShip?:OrderShip;
}
export interface OrderShip {
    labelID?:string;
    shipStatusID?:number;
    reason_code?:number;
    reason?:string;
    status?:string;
    create_Date?:Date;
}