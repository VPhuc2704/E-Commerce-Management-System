import { mockUserData, mockAddresses } from "../mockdata/productData"

const profileService = {
  // Get user profile data
  getUserProfile: async (userId) => {
    try {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            name: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0901234567",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            bio: "Yêu thích ẩm thực Việt Nam và các món ăn đường phố châu Á.",
          })
        }, 500)
      })
    } catch (error) {
      throw new Error("Không thể tải thông tin người dùng")
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            resolve(profileData)
          } else {
            reject(new Error("Cập nhật thất bại"))
          }
        }, 800)
      })
    } catch (error) {
      throw new Error("Không thể cập nhật thông tin")
    }
  },

  // Change password
  updatePassword: async (passwordData) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (passwordData.newPassword.length < 6) {
            reject(new Error("Mật khẩu phải có ít nhất 6 ký tự"))
            return
          }
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            reject(new Error("Mật khẩu xác nhận không khớp"))
            return
          }
          if (Math.random() > 0.1) {
            resolve({ success: true })
          } else {
            reject(new Error("Cập nhật mật khẩu thất bại"))
          }
        }, 800)
      })
    } catch (error) {
      throw new Error("Không thể thay đổi mật khẩu")
    }
  },

  // Get user addresses
  getUserAddresses: async (userId) => {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Nhà riêng",
              recipient: "Nguyễn Văn A",
              phone: "0901234567",
              address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1",
              city: "TP. Hồ Chí Minh",
              isDefault: true,
            },
            {
              id: 2,
              name: "Văn phòng",
              recipient: "Nguyễn Văn A",
              phone: "0909876543",
              address: "456 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1",
              city: "TP. Hồ Chí Minh",
              isDefault: false,
            },
          ])
        }, 1000)
      })
    } catch (error) {
      throw new Error("Không thể tải danh sách địa chỉ")
    }
  },

  // Add new address
  addAddress: async (userId, addressData) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            // 90% success rate
            resolve({
              ...addressData,
              id: Date.now(),
              isDefault: false,
            })
          } else {
            reject(new Error("Thêm địa chỉ thất bại"))
          }
        }, 500)
      })
    } catch (error) {
      throw new Error("Không thể thêm địa chỉ mới")
    }
  },

  // Update address
  updateAddress: async (userId, addressId, addressData) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            // 90% success rate
            resolve({ ...addressData, id: addressId })
          } else {
            reject(new Error("Cập nhật địa chỉ thất bại"))
          }
        }, 500)
      })
    } catch (error) {
      throw new Error("Không thể cập nhật địa chỉ")
    }
  },

  // Delete address
  deleteAddress: async (addressId) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            // 90% success rate
            resolve({ success: true })
          } else {
            reject(new Error("Xóa địa chỉ thất bại"))
          }
        }, 500)
      })
    } catch (error) {
      throw new Error("Không thể xóa địa chỉ")
    }
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    try {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.1) {
            // 90% success rate
            resolve({ success: true })
          } else {
            reject(new Error("Cập nhật địa chỉ mặc định thất bại"))
          }
        }, 500)
      })
    } catch (error) {
      throw new Error("Không thể đặt địa chỉ mặc định")
    }
  },

  // Update getUserInfo method to use mock data
  getUserInfo: async (user) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: user?.name || mockUserData.name,
          email: user?.email || mockUserData.email,
          phone: user?.phone || mockUserData.phone,
          address: user?.address || mockUserData.address,
          bio: user?.bio || mockUserData.bio,
        })
      }, 500)
    })
  },

  // Update getAddresses method to use mock data
  getAddresses: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAddresses)
      }, 1000)
    })
  },
}

export default profileService
