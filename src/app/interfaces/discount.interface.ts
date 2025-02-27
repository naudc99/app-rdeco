import { Product } from "./product.interface";

export interface Discount {
    id: number; 
    percentage: number; 
    product: Product;
  }
  