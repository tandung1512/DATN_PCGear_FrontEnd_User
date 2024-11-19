import { Product } from '../product/product.model';

export interface Category {
  id: string;
  name: string;
  description: string;
  isHot: boolean; // Thêm thuộc tính isHot để xác định danh mục nổi bật
  products: Product[];
}