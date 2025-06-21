import { API_BASE_URL } from '../constants/productConstants';

class ProfileService {
  async getUserInfo(user) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('Người dùng chưa đăng nhập');
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/user/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch user info');
      }

      const userData = await response.json();
      return {
        name: userData.name || userData.fullname || "",
        email: userData.email || user?.email || "",
        phone: userData.phone || userData.numberphone || "",
        address: userData.address || "",
        bio: userData.bio || userData.description || "",
        avatar: userData.avatar || userData.profileImage || ""
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  async updateUserInfo(userInfo) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const payload = {
        name: userInfo.name || userInfo.fullname || "",
        email: userInfo.email || "",
        phone: userInfo.phone || userInfo.numberphone || "",
        address: userInfo.address || "",
        bio: userInfo.bio || ""
      };

      const response = await fetch(`${API_BASE_URL}/user/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update user info');
      }

      const updatedUser = await response.json();
      return {
        name: updatedUser.name || updatedUser.fullname || "",
        email: updatedUser.email || userInfo.email || "",
        phone: updatedUser.phone || updatedUser.numberphone || "",
        address: updatedUser.address || "",
        bio: updatedUser.bio || updatedUser.description || "",
        avatar: updatedUser.avatar || updatedUser.profileImage || ""
      };
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error;
    }
  }

  async updateAvatar(avatarFile) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await fetch(`${API_BASE_URL}/user/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update avatar');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  async getAddresses() {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/user/addresses`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch addresses');
      }

      const addresses = await response.json();
      return Array.isArray(addresses) ? addresses : [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      return [];
    }
  }

  async addAddress(address) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/user/addresses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(address)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to add address');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  }

  async updateAddress(addressId, address) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(address)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to update address');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  async deleteAddress(addressId) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete address');
      }

      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      return [];
    }
  }

  async changePassword(oldPassword, newPassword) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword,
          newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to change password');
      }

      return await response.json();
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  async setDefaultAddress(addressId) {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/user/addresses/${addressId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to set default address');
      }

      return true;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }
}

const profileService = new ProfileService();
export default profileService;