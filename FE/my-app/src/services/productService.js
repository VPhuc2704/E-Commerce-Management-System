import { categories, mockProductListing, mockFeedbacks } from '../mockdata/productData';
import { addToCart as cartAddToCart } from './cartService';
import { placeOrder as orderPlaceOrder } from './orderService';

export const fetchProductDetails = async (productId, navigate) => {
  try {
    console.log('Đầu vào productId:', productId);
    const id = parseInt(productId);
    console.log('ID đã parse:', id);

    if (isNaN(id)) {
      console.error('ID sản phẩm không hợp lệ:', productId);
      navigate && navigate('/');
      return null;
    }

    let foundProduct = null;
    for (const category of categories) {
      const product = category.items.find(item => item.id === id);
      if (product) {
        foundProduct = {
          id: product.id,
          name: product.name,
          price: (product.originalPrice || 0) * 1000, // Xử lý undefined, mặc định 0
          imageUrl: product.imageUrl || '/img/default.jpg',
          category: category.name,
          feedbacks: mockFeedbacks,
        };
        break;
      }
    }

    if (!foundProduct) {
      const product = mockProductListing.find(item => item.id === id);
      if (product) {
        foundProduct = {
          id: product.id,
          name: product.name,
          price: product.originalPrice || 0, // Giá từ mockProductListing đã là VNĐ
          imageUrl: product.imageUrl || '/img/default.jpg',
          category: product.category,
          feedbacks: mockFeedbacks,
        };
      }
    }

    console.log('Sản phẩm cuối cùng:', foundProduct);
    if (!foundProduct) {
      console.warn('Không tìm thấy sản phẩm với ID:', id);
      navigate && navigate('/');
      return null;
    }

    return foundProduct;
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
    navigate && navigate('/');
    return null;
  }
};

export const fetchRelatedProducts = async (productId) => {
  try {
    const id = parseInt(productId);
    console.log('Lấy sản phẩm liên quan cho ID:', id);
    const currentProduct = categories.flatMap(cat => cat.items).find(item => item.id === id);
    let related = [];
    if (currentProduct) {
      const sameCategory = categories.find(cat => cat.items.some(item => item.id === id));
      if (sameCategory) {
        related = sameCategory.items.filter(item => item.id !== id).slice(0, 5);
      }
      if (related.length < 5) {
        const allProducts = categories.flatMap(cat => cat.items)
          .filter(item => item.id !== id)
          .sort((a, b) => b.soldCount - a.soldCount);
        related = [...related, ...allProducts.filter(p => !related.includes(p))].slice(0, 5);
      }
    }
    console.log('Sản phẩm liên quan:', related);
    return related.map(p => ({
      ...p,
      price: (p.originalPrice || 0) * 1000, // Đảm bảo giá hợp lệ
    }));
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm liên quan:', error);
    return [];
  }
};

export const checkPurchaseStatus = async () => {
  try {
    return true; // Mock cho demo
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái mua hàng:', error);
    return false;
  }
};

export const fetchProducts = async (currentPage, productsPerPage, searchTerm, priceRange, category) => {
  try {
    console.log('Lấy sản phẩm với tham số:', { currentPage, productsPerPage, searchTerm, priceRange, category });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Dữ liệu mockProductListing:', mockProductListing);
    let filteredProducts = mockProductListing.map(product => ({
      ...product,
      originalPrice: product.originalPrice || 0, // Xử lý undefined
    }));
    
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filteredProducts = filteredProducts.filter(product =>
      product.originalPrice >= priceRange[0] * 1000 && product.originalPrice <= priceRange[1] * 1000
    );
    
    if (category) {
      filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    console.log('Sản phẩm sau lọc:', filteredProducts);
    
    const total = filteredProducts.length;
    const startIndex = (currentPage - 1) * productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);
    
    console.log('Sản phẩm phân trang:', paginatedProducts);
    return {
      products: paginatedProducts,
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