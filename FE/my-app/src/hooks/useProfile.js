
import { useState, useEffect } from "react"
import profileService from "../services/profileService"

const useProfile = (user) => {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  })
  const [addresses, setAddresses] = useState([])
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })

  // Fetch user data and addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await profileService.getUserInfo(user)
        setUserInfo(userData)
        const addressData = await profileService.getAddresses()
        setAddresses(addressData)
      } catch (error) {
        showNotification("Lỗi khi tải dữ liệu!", "error")
      }
    }
    fetchData()
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = async () => {
    try {
      await profileService.updateProfile(userInfo)
      setIsEditing(false)
      showNotification("Thông tin cá nhân đã được cập nhật!", "success")
    } catch (error) {
      showNotification("Cập nhật thất bại!", "error")
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification("Mật khẩu mới không khớp!", "error")
      return
    }
    if (passwordForm.newPassword.length < 6) {
      showNotification("Mật khẩu phải có ít nhất 6 ký tự!", "error")
      return
    }
    try {
      await profileService.updatePassword(passwordForm)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      showNotification("Mật khẩu đã được cập nhật!", "success")
    } catch (error) {
      showNotification("Cập nhật mật khẩu thất bại!", "error")
    }
  }

  const handleSetDefaultAddress = async (id) => {
    try {
      await profileService.setDefaultAddress(id)
      setAddresses(addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })))
      showNotification("Đã cập nhật địa chỉ mặc định!", "success")
    } catch (error) {
      showNotification("Cập nhật địa chỉ thất bại!", "error")
    }
  }

  const handleDeleteAddress = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      try {
        await profileService.deleteAddress(id)
        setAddresses(addresses.filter((addr) => addr.id !== id))
        showNotification("Đã xóa địa chỉ thành công!", "success")
      } catch (error) {
        showNotification("Xóa địa chỉ thất bại!", "error")
      }
    }
  }

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 4000)
  }

  return {
    activeTab,
    setActiveTab,
    isEditing,
    setIsEditing,
    selectedOrder,
    setSelectedOrder,
    userInfo,
    addresses,
    passwordForm,
    notification,
    handleInputChange,
    handlePasswordChange,
    handleSaveProfile,
    handleUpdatePassword,
    handleSetDefaultAddress,
    handleDeleteAddress,
    showNotification,
  }
}

export default useProfile
