import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productService';

export const useProductListing = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [category, setCategory] = useState('');
  const productsPerPage = 10;

  useEffect(() => {
    const loadProducts = async () => {
      const { products, total } = await fetchProducts(
        currentPage,
        productsPerPage,
        searchTerm,
        priceRange,
        category
      );
      setProducts(products);
      setTotalPages(Math.ceil(total / productsPerPage));
    };

    loadProducts();
  }, [currentPage, searchTerm, priceRange, category]);

  return {
    products,
    setProducts,
    currentPage,
    setCurrentPage,
    totalPages,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    category,
    setCategory,
    productsPerPage,
  };
};