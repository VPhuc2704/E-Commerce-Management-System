import { fetchProductDetails } from './productService';

export const fetchCartItems = () => {
  try {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    return [];
  }
};

export const saveCart = (cartItems) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
  } catch (error) {
    console.error('Lỗi khi lưu giỏ hàng:', error);
  }
};

export const addToCart = async (productId, quantity, navigate) => {
  try {
    console.log('Thêm sản phẩm vào giỏ hàng:', { productId, quantity });
    const id = parseInt(productId);
    const qty = parseInt(quantity);

    if (isNaN(id) || isNaN(qty) || qty <= 0) {
      console.error('ID hoặc số lượng không hợp lệ:', { productId, quantity });
      return { success: false, error: 'Dữ liệu không hợp lệ' };
    }

    const product = await fetchProductDetails(productId, navigate);
    if (!product) {
      console.error('Không tìm thấy sản phẩm với ID:', id);
      return { success: false, error: 'Sản phẩm không tồn tại' };
    }

    const cartItems = fetchCartItems();
    let updatedCart;

    const existingItem = cartItems.find(item => item.productId === id);
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.productId === id
          ? {
              ...item,
              quantity: item.quantity + qty,
              totalPrice: (item.quantity + qty) * item.pricePerUnit,
            }
          : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: null,
          productId: id,
          productName: product.name,
          productImage: product.imageUrl,
          quantity: qty,
          pricePerUnit: product.price,
          totalPrice: qty * product.price,
        },
      ];
    }

    saveCart(updatedCart);
    console.log('Giỏ hàng đã cập nhật:', updatedCart);
    return { success: true };
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
    return { success: false, error: error.message };
  }
};

export const processPayment = async (paymentMethod, selectedItems, cartItems) => {
  try {
    const itemsToPay = cartItems.filter(item => selectedItems.includes(item.productId));
    if (itemsToPay.length === 0) {
      return { success: false, error: 'Không có sản phẩm nào được chọn' };
    }

    // Load thông tin người dùng
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.email || !userInfo.fullname || !userInfo.numberphone || !userInfo.address) {
      return { success: false, error: 'Thiếu thông tin người dùng' };
    }

    const orderData = {
      buyNow: false,
      items: itemsToPay.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
      })),
      paymentMethod,
      user: userInfo,
    };

    const response = await orderService.placeOrder(orderData);
    if (response.order) {
      // Xóa các mục đã thanh toán khỏi giỏ hàng
      const newCart = cartItems.filter(item => !selectedItems.includes(item.productId));
      saveCart(newCart);
      return {
        success: true,
        vnpayCode: paymentMethod === 'VNPAY' ? 'VNPAY-' + Math.random().toString(36).substr(2, 8) : null,
        redirectUrl: response.redirectUrl,
      };
    } else {
      return { success: false, error: response.error };
    }
  } catch (error) {
    console.error('Lỗi khi xử lý thanh toán:', error);
    return { success: false, error: error.message };
  }
};