import { useState, useCallback } from 'react'
import { ORDERS_API } from '../constants/orderConstants'

export const useOrderApi = () => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // ✅ Use useCallback to prevent function recreation
    const getAllOrders = useCallback(async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${ORDERS_API}/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || 'Failed to fetch orders')
            }

            const data = await response.json()
            return Array.isArray(data) ? data : [data].filter(Boolean)
        } catch (error) {
            console.error('Error fetching orders:', error)
            setError(error.message)
            return []
        } finally {
            setLoading(false)
        }
    }, []) // ✅ Empty dependency array since it doesn't depend on any values

    const getOrdersByStatus = useCallback(async (status) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${ORDERS_API}/status?status=${status}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || 'Failed to fetch orders by status')
            }

            const data = await response.json()
            return Array.isArray(data) ? data : [data].filter(Boolean)
        } catch (error) {
            console.error('Error fetching orders by status:', error)
            setError(error.message)
            return []
        } finally {
            setLoading(false)
        }
    }, [])

    const updateOrderStatus = useCallback(async (orderId, orderStatus) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${ORDERS_API}/admin/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId, orderStatus })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || 'Failed to update order status')
            }

            return true
        } catch (error) {
            console.error('Error updating order status:', error)
            setError(error.message)
            return false
        } finally {
            setLoading(false)
        }
    }, [])

    const getOrderDetails = useCallback(async (orderId) => {
        setLoading(true)
        try {
            const token = localStorage.getItem('accessToken')
            if (!token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${ORDERS_API}/details/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || 'Failed to fetch order details')
            }

            const data = await response.json()
            return data
        } catch (error) {
            console.error('Error fetching order details:', error)
            setError(error.message)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    return {
        loading,
        error,
        getAllOrders,
        getOrdersByStatus,
        updateOrderStatus,
        getOrderDetails
    }
}