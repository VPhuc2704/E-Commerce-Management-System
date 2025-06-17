import { useState, useEffect } from 'react';
import { processPayment, fetchCartItems, saveCart } from '../services/cartService';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: '',
    fullname: '',
    numberphone: '',
    address: '',
  });
  const [isUserInfoValid, setIsUserInfoValid] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const navigate = useNavigate();
  const itemsPerPage = 4;

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const profile = await profileService.getUserInfo();
        setUserInfo({
          email: profile.email || '',
          fullname: profile.name || '',
          numberphone: profile.phone || '',
          address: profile.address || '',
        });
      } catch (error) {
        console.error('Lỗi khi tải thông tin người dùng:', error);
        setUserInfo({
          email: '',
          fullname: '',
          numberphone: '',
          address: '',
        });
      }
    };
    fetchUserInfo();
  }, []);

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

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  const paginatedItems = cartItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) => {
      const newSelected = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      console.log('Selected items updated:', newSelected);
      return newSelected;
    });
  };

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

  const validateUserInfo = () => {
    const { email, fullname, numberphone, address } = userInfo;
    return email && fullname && numberphone && address;
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return;
    }
    if (!validateUserInfo()) {
      alert('Vui lòng cập nhật thông tin cá nhân trước khi thanh toán!');
      navigate('/profile?redirect=/cart');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!validateUserInfo()) {
      alert('Vui lòng cập nhật thông tin cá nhân trước khi thanh toán!');
      navigate('/profile?redirect=/cart');
      return;
    }
    setIsLoading(true);
    try {
      const validCartItems = Array.isArray(cartItems) ? cartItems : [];
      const response = await processPayment(paymentMethod, selectedItems, validCartItems);
      if (response.success) {
        if (paymentMethod === 'COD') {
          alert('Đặt hàng thành công! Chờ xác nhận từ cửa hàng.');
        } else if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
        const newCart = validCartItems.filter((item) => !selectedItems.includes(item.productId));
        saveCart(newCart);
        setSelectedItems([]);
        loadCart();
      } else {
        alert(`Thanh toán thất bại: ${response.error}`);
      }
    } catch (err) {
      alert('Đã xảy ra lỗi khi xử lý thanh toán.');
    } finally {
      setIsLoading(false);
      setShowPaymentModal(false);
    }
  };

  const handleSaveUserInfo = () => {
    if (!validateUserInfo()) {
      setIsUserInfoValid(false);
      return;
    }
    setShowPaymentModal(false);
  };

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
    isLoading,
    itemsPerPage,
    totalQuantity,
    totalPages,
    paginatedItems,
    totalAmount,
    cartTotalPrice,
    userInfo,
    isUserInfoValid,
    showPaymentModal,
    paymentMethod,
    setPaymentMethod,
    setShowPaymentModal,
    addItemToCart,
    handleSelectItem,
    handleSelectAll,
    handleQuantityChange,
    handleRemoveItem,
    handleCheckout,
    handlePayment,
    handleSaveUserInfo,
    containerVariants,
    itemVariants,
    cardHoverVariants,
    setCurrentPage,
    setUserInfo,
  };
};