import { useState, useEffect } from 'react';
import { processPayment, fetchCartItems, saveCart } from '../services/cartService';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPaymentCode, setShowPaymentCode] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [vnpayCode, setVnpayCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    fullname: '',
    numberphone: '',
    address: '',
  });
  const [isUserInfoValid, setIsUserInfoValid] = useState(true);
  const itemsPerPage = 4;

  // Kiểm tra mục hợp lệ
  const isValidItem = (item) => {
    const valid = (
      item &&
      typeof item.productId === 'number' &&
      typeof item.productName === 'string' &&
      typeof item.quantity === 'number' &&
      item.quantity >= 1 &&
      typeof item.pricePerUnit === 'number' &&
      item.pricePerUnit >= 0 &&
      typeof item.totalPrice === 'number' &&
      item.totalPrice >= 0 &&
      (item.productImage === undefined || typeof item.productImage === 'string')
    );
    if (!valid) {
      console.warn('Mục không hợp lệ bị lọc bỏ:', item);
    }
    return valid;
  };

  // Load cart
  const loadCart = () => {
    try {
      const validCart = fetchCartItems().filter(isValidItem);
      console.log('Đã tải giỏ hàng:', validCart);
      setCartItems(validCart);
      setSelectedItems((prev) => prev.filter((id) => validCart.some((item) => item.productId === id)));
      if (validCart.length !== fetchCartItems().length) {
        saveCart(validCart);
      }
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error);
      setCartItems([]);
      setSelectedItems([]);
      saveCart([]);
    }
  };

  // Load user info
  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);

  // Load cart initially and listen for changes
  useEffect(() => {
    loadCart();
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        console.log('localStorage "cart" thay đổi:', e.newValue);
        loadCart();
      }
    };
    const handleCartUpdated = () => {
      console.log('Sự kiện cartUpdated được kích hoạt');
      loadCart();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  // Add item to cart
  const addItemToCart = (product) => {
    if (!isValidItem(product)) {
      console.error('Không thể thêm sản phẩm không hợp lệ:', product);
      return false;
    }
    const existingItem = cartItems.find((item) => item.productId === product.productId);
    let newCart;
    if (existingItem) {
      newCart = cartItems.map((item) =>
        item.productId === product.productId
          ? {
              ...item,
              quantity: item.quantity + product.quantity,
              totalPrice: (item.quantity + product.quantity) * item.pricePerUnit,
            }
          : item
      );
    } else {
      newCart = [
        ...cartItems,
        {
          id: null,
          productId: product.productId,
          productName: product.productName,
          productImage: product.productImage,
          quantity: product.quantity,
          pricePerUnit: product.pricePerUnit,
          totalPrice: product.quantity * product.pricePerUnit,
        },
      ];
    }
    saveCart(newCart);
    loadCart();
    return true;
  };

  // Calculate derived values
  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  const paginatedItems = cartItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  // Handle item selection
  const handleSelectItem = (productId) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      console.log('Selected items updated:', newSelected);
      return newSelected;
    });
  };

  // Select all items
  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
      console.log('Deselected all items');
    } else {
      const newSelected = cartItems.map((item) => item.productId);
      setSelectedItems(newSelected);
      console.log('Selected all items:', newSelected);
    }
  };

  // Update quantity
  const handleQuantityChange = (productId, delta) => {
    const newCart = cartItems.map((item) => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, (item.quantity || 0) + delta);
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: newQuantity * item.pricePerUnit,
        };
      }
      return item;
    });
    saveCart(newCart);
    loadCart();
  };

  // Remove item
  const handleRemoveItem = (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      const newCart = cartItems.filter((item) => item.productId !== productId);
      saveCart(newCart);
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      loadCart();
    }
  };

  // Validate user info
  const validateUserInfo = () => {
    const { email, fullname, numberphone, address } = userInfo;
    return email && fullname && numberphone && address;
  };

  // Handle checkout
  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return;
    }
    if (!validateUserInfo()) {
      setShowUserInfoModal(true);
      setIsUserInfoValid(false);
      return;
    }
    setShowPaymentOptions(true);
  };

  // Handle payment
  const handlePaymentMethod = async (method) => {
    setPaymentMethod(method);
    setShowPaymentOptions(false);
    setIsLoading(true);

    try {
      const { success, vnpayCode, error, redirectUrl } = await processPayment(method, selectedItems, cartItems);
      if (success) {
        if (method === 'VNPAY' && redirectUrl) {
          setVnpayCode(vnpayCode);
          setShowPaymentCode(true);
          window.location.href = redirectUrl;
        } else {
          alert('Đặt hàng thành công! Chờ xác nhận.');
          setSelectedItems([]);
          loadCart();
        }
      } else {
        alert(`Thanh toán thất bại: ${error}`);
      }
    } catch (err) {
      alert('Đã xảy ra lỗi khi xử lý thanh toán.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle confirm VNPAY payment
  const handleConfirmVnpayPayment = () => {
    alert('Thanh toán VNPAY thành công!');
    const newCart = cartItems.filter((item) => !selectedItems.includes(item.productId));
    saveCart(newCart);
    setSelectedItems([]);
    setShowPaymentCode(false);
    loadCart();
  };

  // Handle copying VNPAY code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(vnpayCode);
      const toast = document.createElement('div');
      toast.className =
        'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
      toast.textContent = 'Mã VNPAY đã được sao chép!';
      document.body.appendChild(toast);

      setTimeout(() => toast.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    } catch (err) {
      alert('Không thể sao chép mã. Vui lòng thử lại!');
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const cardHoverVariants = {
    hover: {
      y: -8,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: { duration: 0.3 },
    },
  };

  return {
    cartItems,
    selectedItems,
    currentPage,
    paymentMethod,
    showPaymentOptions,
    showPaymentCode,
    showUserInfoModal,
    vnpayCode,
    isLoading,
    itemsPerPage,
    totalQuantity,
    totalPages,
    paginatedItems,
    totalAmount,
    cartTotalPrice,
    userInfo,
    isUserInfoValid,
    addItemToCart,
    handleSelectItem,
    handleSelectAll,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout,
    handlePaymentMethod,
    handleConfirmVnpayPayment,
    handleCopyCode,
    containerVariants,
    itemVariants,
    cardHoverVariants,
    setCurrentPage,
    setShowPaymentOptions,
    setShowPaymentCode,
    setShowUserInfoModal,
    setUserInfo,
    setIsUserInfoValid,
  };
};