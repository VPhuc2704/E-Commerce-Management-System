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
          price: product.price || 10000, // Fallback 10,000 VNĐ nếu giá không hợp lệ
          imageUrl: product.imageUrl || '/img/default.jpg',
          category: category.name,
          feedbacks: mockFeedbacks,
          description: product.description,
          rating: product.rating,
          soldCount: product.soldCount,
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
          price: (product.originalPrice || 10) * 1000, // Nhân lại 1000 để chuyển về VNĐ
          imageUrl: product.imageUrl || '/img/default.jpg',
          category: product.category,
          feedbacks: mockFeedbacks,
          description: product.description,
          rating: product.rating || 4, // Fallback rating
          soldCount: product.soldCount || 0, // Fallback soldCount
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
          .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        related = [...related, ...allProducts.filter(p => !related.includes(p))].slice(0, 5);
      }
    }
    console.log('Sản phẩm liên quan:', related);
    return related.map(p => ({
      ...p,
      price: p.price || 10000, // Fallback giá
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
    
    let filteredProducts = mockProductListing.map(product => ({
      ...product,
      originalPrice: (product.originalPrice || 10) * 1000, // Nhân lại 1000 để chuyển về VNĐ
    }));
    
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    filteredProducts = filteredProducts.filter(product =>
      ((product.originalPrice || 10) * 1000) >= priceRange[0] * 1000 && 
      ((product.originalPrice || 10) * 1000) <= priceRange[1] * 1000
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