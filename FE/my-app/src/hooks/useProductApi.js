// src/hooks/useProductApi.js
import { useState } from 'react';

import { productService } from '../services/productService';

export const useProductApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const wrapApiCall = async (apiFn) => {
        try {
            setLoading(true);
            setError(null);
            return await apiFn();
        } catch (err) {
            setError(err.message || 'Unexpected error');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAllProducts = () => wrapApiCall(() => productService.getAllProducts());

    const addProduct = (product, imageFile) =>
        wrapApiCall(() => productService.addProduct(product, imageFile));

    const updateProduct = (id, product, imageFile) =>
        wrapApiCall(() => productService.updateProduct(id, product, imageFile));

    const deleteProduct = (id) =>
        wrapApiCall(() => productService.deleteProduct(id));

    return {
        loading,
        error,
        getAllProducts,
        addProduct,
        updateProduct,
        deleteProduct
    };
};
