const BASE_URL = import.meta.env.VITE_API_URL;

export const API_BASE_URL = `${BASE_URL}/api`
export const ADMIN_API = `${API_BASE_URL}/admin/products`
export const PRODUCTS_API = `${API_BASE_URL}/products`

export const CATEGORIES = [
    { value: "", label: "Tất cả danh mục" },
    { value: "1", label: "Khai Vị" },
    { value: "2", label: "Món Chính" },
    { value: "3", label: "Đồ Ăn Nhanh" },
    { value: "4", label: "Đồ Nướng" },
    { value: "5", label: "Món Chay" },
    { value: "6", label: "Đồ Uống" },
    { value: "7", label: "Tráng Miệng" }
]

export const STATUS_MAPPING = {
    Con_Hang: "active",
    Het_Hang: "inactive",
    Ngung_San_Xuat: "discontinued"
}