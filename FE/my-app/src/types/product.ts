export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
    type: string;
    status: 'Con_Hang' | 'Het_Hang' | 'Ngung_San_Xuat';
    categoryId: number;
}

export const DEFAULT_PRODUCT: Product = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    image: '',
    type: '',
    status: 'Con_Hang',
    categoryId: 1
}