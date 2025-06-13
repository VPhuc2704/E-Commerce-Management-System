import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getAllProducts();
            setProducts(data || []);
        } catch (error) {
            setError(error.message);
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Filter products based on search and category
    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' ||
            product.categoryId?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
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