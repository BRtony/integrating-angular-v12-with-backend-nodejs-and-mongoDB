import { Department } from "./department";

export interface Product {
    name: string;
    departments: Department[] | string[] | any[];
    stock: number;
    price: number;
    _id?: string;
}
