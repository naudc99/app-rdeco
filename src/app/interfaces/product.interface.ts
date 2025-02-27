import { Category } from "./category.interface";
import { Discount } from "./discount.interface";

export interface Product {
    id: number;
    referenceNumber: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    stock: number;
    productPhoto: string;
    category: Category;
    discount: Discount;
    }