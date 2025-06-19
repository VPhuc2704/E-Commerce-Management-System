const API_BASE_URL = import.meta.env.VITE_API_URL;

const orderService = {
  // Lấy danh sách đơn hàng của người dùng
  getUserOrders: async (userId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Không thể tải danh sách đơn hàng");
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [data].filter(Boolean);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
      throw new Error(error.message || "Không thể tải danh sách đơn hàng");
    }
  },

  // Lấy chi tiết đơn hàng
  getOrderDetails: async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/details/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Không thể tải chi tiết đơn hàng");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      throw new Error(error.message || "Không thể tải chi tiết đơn hàng");
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/cancel/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Hủy đơn hàng thất bại");
      }

      return { success: true };
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      throw new Error(error.message || "Không thể hủy đơn hàng");
    }
  },

  // Lấy danh sách đơn hàng từ localStorage hoặc API
  getOrders: async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Không thể tải danh sách đơn hàng");
      }

      const data = await response.json();
      localStorage.setItem("orders", JSON.stringify(data));
      return Array.isArray(data) ? data : [data].filter(Boolean);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      const savedOrders = localStorage.getItem("orders");
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
  },

  // Đặt hàng
  placeOrder: async (orderData) => {
    try {
      const { buyNow, productId, quantity, paymentMethod, user, items } = orderData;
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      let orderItems = [];
      let totalAmount = 0;

      if (buyNow) {
        const product = await orderService.fetchProductDetails(productId);
        if (!product) {
          return { error: "Sản phẩm không tồn tại" };
        }
        orderItems = [
          {
            productId: product.id,
            productName: product.name,
            imageUrl: product.imageUrl,
            quantity,
            price: product.price,
          },
        ];
        totalAmount = product.price * quantity;
      } else {
        orderItems = items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          imageUrl: item.productImage,
          quantity: item.quantity,
          price: item.pricePerUnit,
        }));
        totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
      }

      const order = {
        totalAmount,
        status: "PENDING",
        user: {
          fullname: user?.fullname || "Nguyễn Văn A",
          email: user?.email || "nguyenvana@example.com",
          numberphone: user?.numberphone || "0901234567",
          address: user?.address || "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        },
        items: orderItems,
        paymentMethod,
      };

      const response = await fetch(`${API_BASE_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Không thể tạo đơn hàng");
      }

      const savedOrder = await response.json();
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      savedOrders.push(savedOrder);
      localStorage.setItem("orders", JSON.stringify(savedOrders));

      const redirectUrl =
        paymentMethod === "VNPAY"
          ? `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId=${savedOrder.id}&amount=${savedOrder.totalAmount}`
          : null;

      return { order: savedOrder, redirectUrl };
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      return { error: error.message || "Không thể tạo đơn hàng" };
    }
  },

  // Lấy thông tin sản phẩm
  fetchProductDetails: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Không thể lấy thông tin sản phẩm");
      }

      const product = await response.json();
      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
      };
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      return null;
    }
  },
};

export default orderService;