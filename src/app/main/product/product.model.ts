export interface Product {
    id: string;
    name: string;
    quantity: number;
    price: number;
    description: string;
    status: string;
    image1: string;
    image2: string;
    category: any;  // Tùy thuộc vào cấu trúc của Category
    distinctives: any[];  // Tùy thuộc vào cấu trúc của Distinctive
  }
  