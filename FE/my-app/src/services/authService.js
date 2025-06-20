// Base API URL - replace with your actual API URL
const API_URL = "http://localhost:8081/api/auth"

// Helper to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }

  return data
}

// Login service
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json()

  // console.log("Login response:", data) // <-- Kiểm tra có token không

  if (!response.ok) {
    // Nếu status không phải 2xx, tức là login fail
    // Ném lỗi ra, kèm message backend trả về
    throw new Error(data.message || "Đăng nhập thất bại")
  }
  return data
}

// Register service - FIXED EXPORT
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Đăng ký thất bại")
    }

    return data // Return the response data, not just the response object
  } catch (error) {
    console.error("Register error:", error)
    throw error
  }
}

// Logout service
export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken")
  const accessToken = localStorage.getItem("accessToken")
  if (!refreshToken || !accessToken) {
    console.warn("No tokens found in localStorage for logout.")
    return
  }
  try {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refreshToken }), // Gửi ID người dùng để logout
    })
  } catch (err) {
    console.error("Lỗi khi gửi yêu cầu logout:", err)
    // Dù lỗi vẫn tiếp tục xóa token ở FE
  }
}

// Get current authenticated user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("userData")
  if (!userStr) {
    return null
  }
  try {
    const user = JSON.parse(userStr)
    return user
  } catch (error) {
    console.error("Lỗi khi phân tích user từ localStorage:", error)
    return null
  }
}

export const sendForgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  if (!response.ok) {
    // const errorMessage = await response.text();
    const errorData = await response.json()
    const errorMessage = errorData.message || "Gửi OTP thất bại"
    throw new Error(errorMessage)
    // throw new Error(errorMessage || "Gửi OTP thất bại");
  }

  return true
}

export const verifyToken = async (code) => {
  const response = await fetch(`${API_URL}/verify?token=${code}`, {
    method: "POST",
  })
  if (!response.ok) {
    const errorData = await response.json()
    const errorMessage = errorData.message || "Mã OTP không hợp lệ"
    throw new Error(errorMessage)
  }
  const data = await response.json()
  return data.token // trả token cho bước reset mật khẩu
}

export const resetPassword = async ({ token, newPassword, confirmPassword }) => {
  const response = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newPassword, confirmPassword }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || "Không thể đặt lại mật khẩu")
  }

  return true
}

// Default export object
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  sendForgotPassword,
  verifyToken,
  resetPassword,
}

export default authService
