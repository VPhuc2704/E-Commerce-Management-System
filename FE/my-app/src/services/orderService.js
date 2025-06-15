import { fetchProductDetails } from './productService';

export const getOrders = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockOrders = [
        {
          id: 7,
          createdDate: '2025-06-09T13:14:10.468',
          totalAmount: 64000.0,
          status: 'PENDING',
          user: {
            email: '2251120103@ut.edu.vn',
            fullname: 'VanPhuc',
            numberphone: '0355308724',
            address: '39/11a Duong 102, Tang Nhon Phu A, TP.HCM',
          },
          items: [
            {
              id: 8,
              productId: 6,
              productName: 'Chả giò hải sản',
              imageUrl: '/img/cha_gio_6.jpg',
              quantity: 2,
              price: 32000.0,
            },
          ],
        },
        {
          id: 8,
          createdDate: '2025-06-08T10:30:00.000',
          totalAmount: 120000.0,
          status: 'COMPLETED',
          user: {
            email: '2251120103@ut.edu.vn',
            fullname: 'VanPhuc',
            numberphone: '0355308724',
            address: '39/11a Duong 102, Tang Nhon Phu A, TP.HCM',
          },
          items: [
            {
              id: 9,
              productId: 5,
              productName: 'Phở bò',
              imageUrl: '/img/pho_bo_5.jpg',
              quantity: 1,
              price: 120000.0,
            },
          ],
        },
      ];
      resolve(mockOrders);
    }, 800);
  });
};

export const placeOrder = async (orderData) => {
  try {
    const { buyNow, productId, quantity, paymentMethod, user, items } = orderData;

    let orderItems = [];
    let totalAmount = 0;

    if (buyNow) {
      // Xử lý "Mua ngay"
      const product = await fetchProductDetails(productId, null);
      if (!product) {
        return { error: 'Sản phẩm không tồn tại' };
      }
      orderItems = [
        {
          id: Math.floor(Math.random() * 1000) + 1,
          productId: product.id,
          productName: product.name,
          imageUrl: product.imageUrl,
          quantity,
          price: product.price,
        },
      ];
      totalAmount = product.price * quantity;
    } else {
      // Xử lý từ giỏ hàng
      orderItems = items.map((item) => ({
        id: Math.floor(Math.random() * 1000) + 1,
        productId: item.productId,
        productName: item.productName,
        imageUrl: item.productImage,
        quantity: item.quantity,
        price: item.pricePerUnit,
      }));
      totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
    }

    // Tạo đơn hàng
    const order = {
      id: Math.floor(Math.random() * 1000) + 1,
      createdDate: new Date().toISOString(),
      totalAmount,
      status: 'PENDING',
      user,
      items: orderItems,
      paymentMethod,
    };

    // Lưu vào localStorage
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    savedOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(savedOrders));

    // Xử lý VNPAY
    const redirectUrl =
      paymentMethod === 'VNPAY'
        ? `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId=${order.id}&amount=${order.totalAmount}`
        : null;

    return { order, redirectUrl };
  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error);
    return { error: error.message };
  }
};