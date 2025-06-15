const profileService = {
  getUserInfo: async (user) => {
    // Simulate API call or localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: user?.name || 'Nguyễn Văn A',
          email: user?.email || 'nguyenvana@example.com',
          phone: user?.phone || '0901234567',
          avatar: user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: user?.bio || 'Yêu thích ẩm thực Việt Nam và các món ăn đường phố châu Á.',
        });
      }, 500);
    });
  },

  getAddresses: async () => {
    // Simulate API call or localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Nhà riêng',
            recipient: 'Nguyễn Văn A',
            phone: '0901234567',
            address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1',
            city: 'TP. Hồ Chí Minh',
            isDefault: true,
          },
          {
            id: 2,
            name: 'Văn phòng',
            recipient: 'Nguyễn Văn A',
            phone: '0909876543',
            address: '456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1',
            city: 'TP. Hồ Chí Minh',
            isDefault: false,
          },
        ]);
      }, 1000);
    });
  },

  updateProfile: async (userInfo) => {
    // Simulate API call or localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
  },

  updatePassword: async (passwordForm) => {
    // Simulate API call or localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
  },

  setDefaultAddress: async (id) => {
    // Simulate API call or localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
  },

  deleteAddress: async (id) => {
    // Simulate API call or localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
  },
};

export default profileService;