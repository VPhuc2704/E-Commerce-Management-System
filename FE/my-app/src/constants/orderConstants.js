export const API_BASE_URL = "http://localhost:8081/api"
export const ORDERS_API = `${API_BASE_URL}/orders`
export const ADMIN_ORDERS_API = `${API_BASE_URL}/admin/orders`

export const ORDER_STATUS = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    SHIPPED: "SHIPPED",
    DELIVERED: "DELIVERED",
    CANCELLED: "CANCELLED"
}

export const STATUS_LABELS = {
    PENDING: "Đang chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPED: "Chờ giao hàng",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Đã hủy"
}

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
    value,
    label
}))