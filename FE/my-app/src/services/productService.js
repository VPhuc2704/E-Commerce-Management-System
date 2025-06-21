import { ORDER_STATUS } from '../constants/orderConstants';
import { API_BASE_URL } from '../constants/productConstants';
// import { categories, mockProductListing, mockFeedbacks } from '../mockdata/productData';
import { addToCart as cartAddToCart } from './cartService';
import orderService from './orderService';

class ProductService {
    async getAllProducts() {
        try {

            const response = await fetch(`${API_BASE_URL}/products/all`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch products');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async addProduct(product, imageFile) {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const formData = new FormData();
            const json = JSON.stringify(product);
            const jsonFile = new File([json], "product.json", { type: "application/json" });

            formData.append('productsDTO', jsonFile);

            if (imageFile) formData.append('imageFile', imageFile);

            const response = await fetch(`${API_BASE_URL}/admin/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add product');
            }

            return await response.json();
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    async updateProduct(id, product, imageFile) {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const formData = new FormData();
            const json = JSON.stringify(product);
            const jsonFile = new File([json], "product.json", { type: "application/json" });
            formData.append('productsDTO', jsonFile);
            if (imageFile) {
                formData.append('imageFile', imageFile);
            }

            const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,

                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to update product');
            }

            return await response.json();
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }

            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    async getAllCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/categories/name`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch categories');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    async getProductsByCategory(categoryId) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch products by category');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching products by category:', error);
            throw error;
        }
    }

}

export const productService = new ProductService();
// ------------------
export const fetchProductDetails = async (productId, navigate) => {
    try {
        const id = parseInt(productId);

        if (isNaN(id)) {
            console.error('ID sản phẩm không hợp lệ:', productId);
            navigate && navigate('/');
            return null;
        }

        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
            navigate && navigate('/');
            return null;
        }

        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        navigate && navigate('/');
        return null;
    }
};

export const fetchRelatedProducts = async (productId) => {
    try {
        const response = await fetchProductDetails(productId);
        if (!response || !response.data) return [];

        const product = response.data;
        const categoryId = product.categoryId;

        const products = await productService.getProductsByCategory(categoryId);

        return products.filter(p => p.id !== product.id).slice(0, 5);
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm liên quan:', error);
        return [];
    }
};

export const checkPurchaseStatus = async (status) => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${API_BASE_URL}/orders/status?status=${encodeURIComponent(status)}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) return false;
        return await response.json(); // true / false
    } catch (error) {
        console.error('Lỗi khi kiểm tra mua hàng:', error);
        return false;
    }
};

export const fetchProducts = async (currentPage, productsPerPage, searchTerm, priceRange, category) => {
    try {
        let products = await productService.getAllProducts();

        // Filter theo category nếu có
        if (category) {
            products = products.filter(p => p.category === category);
        }

        // Search
        if (searchTerm) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo giá
        products = products.filter(p =>
            p.price >= priceRange[0] * 1000 && p.price <= priceRange[1] * 1000
        );

        // Phân trang
        const total = products.length;
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginated = products.slice(startIndex, startIndex + productsPerPage);

        return {
            products: paginated,
            total,
        };
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sản phẩm:', error);
        return { products: [], total: 0 };
    }
};

export const addToCart = async (productId, quantity) => {
    return await cartAddToCart(productId, quantity);
};

export const placeOrder = async (orderData) => {
    return await orderPlaceOrder(orderData);
};