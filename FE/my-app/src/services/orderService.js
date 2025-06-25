// Trong file orderService.js
import { mockOrders, getProductById } from "../mockdata/productData";

const orderService = {
  // Get user orders
  getUserOrders: async (userId) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1001,
              date: "15/06/2025",
              total: 450000,
              status: "completed",
              statusText: "Đã giao",
              items: 3,
              location: "Quận 1",
            },
            {
              id: 1002,
              date: "12/06/2025",
              total: 320000,
              status: "pending",
              statusText: "Đang giao",
              items: 2,
              location: "Quận 3",
            },
            {
              id: 1003,
              date: "10/06/2025",
              total: 180000,
              status: "cancelled",
              statusText: "Đã hủy",
              items: 1,
              location: "Quận 1",
            },
          ]);
        }, 800);
      });
    } catch (error) {
      throw new Error("Không thể tải danh sách đơn hàng");
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: orderId,
            date: "15/06/2025",
            total: 450000,
            status: "completed",
            statusText: "Đã giao",
            items: [
              { name: "Phở bò", quantity: 1, price: 65000 },
              { name: "Bánh mì", quantity: 2, price: 25000 },
              { name: "Cà phê sữa", quantity: 1, price: 35000 },
            ],
            address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1",
            phone: "0901234567",
          });
        }, 500);
      });
    } catch (error) {
      throw new Error("Không thể tải chi tiết đơn hàng");
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            // 90% success rate
            resolve({ success: true });
          } else {
            reject(new Error("Hủy đơn hàng thất bại"));
          }
        }, 500);
      });
    } catch (error) {
      throw new Error("Không thể hủy đơn hàng");
    }
  },

  // Update getOrders method to use mock data
  getOrders: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check localStorage first
        const savedOrders = localStorage.getItem("orders");
        if (savedOrders) {
          resolve(JSON.parse(savedOrders));
        } else {
          // Save mock data to localStorage
          localStorage.setItem("orders", JSON.stringify(mockOrders));
          resolve(mockOrders);
        }
      }, 800);
    });
  },

  // Thêm phương thức placeOrder
  placeOrder: async (orderData) => {
    try {
      const { buyNow, productId, quantity, paymentMethod, user, items } = orderData;

      let orderItems = [];
      let totalAmount = 0;

      if (buyNow) {
        // Xử lý "Mua ngay"
        const product = await fetchProductDetails(productId);
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
  },

  // Hàm fetchProductDetails hỗ trợ placeOrder
  fetchProductDetails: async (productId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const product = getProductById(productId);
        if (product) {
          resolve({
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
          });
        } else {
          resolve(null);
        }
      }, 200);
    });
  },
};

export default orderService;