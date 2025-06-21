const BASE_URL = import.meta.env.VITE_API_URL;

export const feedbackService = {
  async getFeedbacksByProduct(productId) {
    const res = await fetch(`${BASE_URL}/api/reviews/products/${productId}`);
    if (!res.ok) throw new Error('Lỗi khi lấy phản hồi');
    return await res.json();
  },

  async postFeedback(productId, { rating, comment, imageFile }) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const formData = new FormData();
    const dto = { rating, comment };
    const blob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
    formData.append('reviewDTO', blob);

    if (imageFile) {
      formData.append('imageFile', imageFile);
    }

    const res = await fetch(`${BASE_URL}/api/reviews/product/${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Gửi phản hồi thất bại');
    }

    return await res.json();
  },
};