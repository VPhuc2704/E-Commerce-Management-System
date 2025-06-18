import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const loadProducts = useCallback(async (categoryId = null) => {
        setLoading(true);
        try {
            let data;
            if (categoryId && categoryId !== '') {
                console.log('Loading products for category:', categoryId);
                data = await productService.getProductsByCategory(categoryId);
            } else {
                console.log('Loading all products');
                data = await productService.getAllProducts();
            }
            console.log('Loaded products:', data);
            setProducts(data || []);
        } catch (error) {
            setError(error.message);
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts(selectedCategory);
    }, [loadProducts, selectedCategory]);

    const filteredProducts = products.filter(product => {
        if (!searchTerm.trim()) return true;
        return (
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleAddProduct = async (productData) => {
        setLoading(true);
        try {
            const result = await productService.addProduct(productData);
            await loadProducts();
            return result;
        } catch (error) {
            setError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProduct = async (productData) => {
        setLoading(true);
        try {
            const result = await productService.updateProduct(productData.id, productData);
            await loadProducts();
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        setLoading(true);
        try {
            const result = await productService.deleteProduct(productId);
            await loadProducts();
            return result;
        } catch (error) {
            setError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        products: filteredProducts,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        addProduct: handleAddProduct,
        updateProduct: handleUpdateProduct,
        deleteProduct: handleDeleteProduct,
        refreshProducts: loadProducts
    };
};