import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import authService from "../services/authService"

/**
 * Custom hook for handling authentication
 * @returns {Object} Authentication methods and state
 */
const useAuth = () => {
  const [user, setUser] = useState(() => {
    const userDataStr = localStorage.getItem("userData")
    return userDataStr ? JSON.parse(userDataStr) : null
  })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Check if we have a accsessToken in localStorage
  const checkAuthStatus = () => {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken) {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}")
        const shouldUpdate = JSON.stringify(user) !== JSON.stringify(userData)
        if (shouldUpdate) {
          setUser(userData)
        }
        return userData
      } catch (err) {
        console.error("Failed to parse stored user data:", err)
        logout()
        return null
      }
    }
    return null
  }

  useEffect(() => {
    const currentUser = checkAuthStatus()
    if (currentUser) {
      // Nếu là admin, chuyển hướng đến trang admin dashboard
      if (currentUser.roles && currentUser.roles.includes("ROLE_ADMIN")) {
        if (["/login", "/", "/home"].includes(window.location.pathname)) {
          navigate("/admin/dashboard", { replace: true })
        }
      }
      // Nếu là user thường, chuyển hướng đến trang home
      else if (["/login", "/"].includes(window.location.pathname)) {
        navigate("/home", { replace: true })
      }
    }
  }, [])

  // Login function
  const login = async (email, password) => {
    setLoading(true)

    try {
      const data = await authService.login(email, password)

      if (!data.accessToken || typeof data.accessToken !== "string") {
        throw new Error("Invalid or missing access token")
      }

      const decoded = jwtDecode(data.accessToken)

      const userData = {
        email: decoded.email || "",
        roles: decoded.roles || [],
        fullname: decoded.fullname || "",
        numberphone: decoded.numberphone || "",
        address: decoded.address || "",
      }

      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("refreshToken", data.refreshToken)
      localStorage.setItem("userData", JSON.stringify(userData))

      setUser(userData)
      setLoading(false)

      // Chuyển hướng dựa trên vai trò
      if (decoded.roles.includes("ROLE_ADMIN")) {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/home", { replace: true })
      }

      return { user: userData, token: data.accessToken }
    } catch (error) {
      setError(error.message)
      setLoading(false)
      throw error
    }
  }

  // Register function
  const register = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const data = await authService.register(userData)
      setLoading(false)
      navigate("/login", { replace: true })
      return data
    } catch (error) {
      setError(error.message || "Đăng ký thất bại")
      setLoading(false)
      throw error
    }
  }

  // Logout function
  const logout = async () => {
    authService.logout()
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("userData")
    localStorage.removeItem("userInfo")
    localStorage.removeItem("lastOrderId")
    localStorage.removeItem("cart")
    localStorage.removeItem("orders")
    setUser(null)
    navigate("/login", { replace: true })
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus,
    isAuthenticated: !!user,
    roles: user?.roles || [],
  }
}
export default useAuth
// Changed from: export default useAuth
// To: export { useAuth }
// export { useAuth }