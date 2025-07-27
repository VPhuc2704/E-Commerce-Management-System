const HOST = import.meta.env.VITE_API_URL;
import orderService from './orderService';

export const fetchCartItems = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const res = await fetch(`${HOST}/api/cart/items/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 401) {
      console.warn("Bạn chưa đăng nhập!");
      return [];
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    // Kiểm tra header để tránh lỗi .json() khi không phải JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Phản hồi không phải JSON');
    }

    const cart = await res.json();
    return Array.isArray(cart.cartItemDTOList) ? cart.cartItemDTOList : [];
  } catch (error) {
    console.error('Lỗi khi lấy giỏ hàng:', error);
    return [];
  }
};

export const addToCart = async (product, quantity) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return { success: false, error: 'Vui lòng đăng nhập' };
  }

  if (!product || !product.id || isNaN(product.id)) {
    console.error('Product ID không hợp lệ:', product);
    return { success: false, error: 'Sản phẩm không hợp lệ' };
  }

  if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) {
    console.error('Số lượng không hợp lệ:', quantity);
    return { success: false, error: 'Số lượng phải là số nguyên dương' };
  }

  try {
    const res = await fetch(`${HOST}/api/cart/items/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: Number(product.id),
        quantity: Number(quantity),
      }),
    });

    const data = await res.text();
    if (!res.ok) {
      console.error('Lỗi server:', res.status, data);
      return { success: false, error: `Lỗi server: ${data || res.statusText}` };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Lỗi khi thêm vào giỏ hàng:', error);
    return { success: false, error: 'Lỗi không xác định' };
  }
};

export const updateCartQuantity = async (productId, quantity) => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${HOST}/api/cart/items/me/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  return data;
};

export const removeFromCart = async (productId) => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${HOST}/api/cart/items/me/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId }),
  });
  const data = await res.text();
  return data;
};

export const processPayment = async (
  paymentMethod,
  selectedItems,
  cartItems,
  buyNowProduct = null,
  quantity = 1
) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.email || !userInfo.fullname || !userInfo.numberphone || !userInfo.address) {
      return { success: false, error: 'Thiếu thông tin người dùng' };
    }

    let orderData;

    if (buyNowProduct) {
      // 👉 Mua ngay 1 sản phẩm
      orderData = {
        buyNow: true,
        productId: buyNowProduct.id,
        quantity: quantity,
        paymentMethod,
        user: userInfo,
      };
    } else {
      // 👉 Mua từ giỏ hàng
      const itemsToPay = cartItems.filter(item => selectedItems.includes(item.productId));
      if (itemsToPay.length === 0) {
        return { success: false, error: 'Không có sản phẩm nào được chọn' };
      }

      orderData = {
        buyNow: false,
        items: itemsToPay.map(item => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.pricePerUnit,
        })),
        paymentMethod,
        user: userInfo,
      };
    }

    const response = await orderService.placeOrder(orderData);
    if (response.order) {
      await fetchCartItems(); // Cập nhật giỏ hàng sau khi thanh toán
      window.dispatchEvent(new Event('cartUpdated')); // Kích hoạt sự kiện để cập nhật UI giỏ hàng
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