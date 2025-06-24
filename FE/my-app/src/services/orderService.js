const API_BASE_URL = import.meta.env.VITE_API_URL;

const orderService = {
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

  placeOrder: async (orderData) => {
    try {
      const { buyNow, productId, quantity, paymentMethod, user, items } = orderData;
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      let payload;

      if (buyNow) {
        payload = {
          buyNow: true,
          productId: productId,
          quantity: quantity,
          paymentMethod: paymentMethod,
          shippingAddress: user?.address,
          recipientPhone: user?.numberphone,
        };
      } else {
        const cartItemIds = items
          .filter((item) => item?.id !== undefined && item?.id !== null)
          .map((item) => item.id);

        if (!cartItemIds.length) {
          throw new Error("Giỏ hàng không hợp lệ hoặc thiếu ID");
        }

        payload = {
          buyNow: false,
          cartItemIds: cartItemIds,
          paymentMethod: paymentMethod,
          shippingAddress: user?.address,
          recipientPhone: user?.numberphone,
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Không thể tạo đơn hàng");
      }

      const result = await response.json();

      if (result.order?.id) {
        localStorage.setItem("lastOrderId", result.order.id);
      }

      return result;

    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      return { error: error.message || "Không thể tạo đơn hàng" };
    }
  },

  getOrderUpdates: async () => {
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
        throw new Error(errorData?.message || "Không thể tải cập nhật đơn hàng");
      }

      const updates = await response.json();
      return updates.map((update) => ({
        id: update.id || `update-${Math.random().toString(36).substr(2, 9)}`,
        orderId: update.orderId,
        status: update.status,
        timestamp: update.timestamp || new Date().toISOString(),
      }));
    } catch (error) {
      console.error("Lỗi khi lấy cập nhật đơn hàng:", error);
      throw new Error(error.message || "Không thể tải cập nhật đơn hàng");
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/admin/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          orderStatus: status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Cập nhật trạng thái thất bại");
      }

      window.dispatchEvent(new Event('cartUpdated')); // Kích hoạt sự kiện
      return { success: true };
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      throw new Error(error.message || "Không thể cập nhật trạng thái");
    }
  },

};

export default orderService;