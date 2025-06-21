import { useState, useEffect } from 'react';
import { processPayment, fetchCartItems, addToCart, updateCartQuantity, removeFromCart } from '../services/cartService';
import { useNavigate } from 'react-router-dom';
import profileService from '../services/profileService';

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
  const [isUserInfoValid, setIsUserInfoValid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalQuantities, setModalQuantities] = useState({}); // State mới để quản lý số lượng trong modal
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
    if (!valid) console.warn('Mục không hợp lệ bị lọc bỏ:', item);
    return valid;
  };

  const fetchCart = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('Người dùng chưa đăng nhập, bỏ qua fetchCart');
      setCartItems([]);
      return;
    }
    try {
      const items = await fetchCartItems();
      const validCart = items.filter(isValidItem);
      setCartItems(validCart);
      setSelectedItems((prev) => prev.filter((id) => validCart.some((item) => item.productId === id)));
      // Cập nhật modalQuantities dựa trên cartItems hiện tại khi mở modal
      const newModalQuantities = validCart.reduce((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {});
      setModalQuantities(newModalQuantities);
    } catch (err) {
      console.error('Lỗi load giỏ hàng:', err);
      setCartItems([]);
      setSelectedItems([]);
    }
    setIsLoading(false);
  };

  const fetchUserInfo = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('Người dùng chưa đăng nhập, bỏ qua fetch user info');
      return null;
    }
    try {
      const profile = await profileService.getUserInfo();
      const updatedUserInfo = {
        email: profile.email || '',
        fullname: profile.name || '',
        numberphone: profile.phone || '',
        address: profile.address || '',
      };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      setIsUserInfoValid(validateUserInfo());
    } catch (error) {
      console.error('Lỗi khi tải thông tin người dùng:', error);
      setUserInfo({ email: '', fullname: '', numberphone: '', address: '' });
      setIsUserInfoValid(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) setUserInfo(JSON.parse(savedUser));
    fetchCart();
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        console.log('localStorage "cart" thay đổi:', e.newValue);
        fetchCart();
      }
    };
    const handleCartUpdated = () => {
      console.log('Sự kiện cartUpdated được kích hoạt');
      fetchCart();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, []);

  const addItemToCart = async (product) => {
    if (!isValidItem(product)) {
      console.error('Không thể thêm sản phẩm không hợp lệ:', product);
      return false;
    }
    try {
      const result = await addToCart({ productId: product.productId, quantity: product.quantity });
      if (result.success) {
        await fetchCart();
        window.dispatchEvent(new Event('cartUpdated')); // Phát sự kiện để cập nhật navbar
        return true;
      }
      return false;
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      return false;
    }
  };

  const handleQuantityChange = async (productId, delta) => {
    setModalQuantities((prev) => {
      const currentQty = prev[productId] || 1;
      const newQty = Math.max(0, currentQty + delta); // Cho phép giảm xuống 0
      const updatedQuantities = { ...prev, [productId]: newQty };

      if (newQty === 0) {
        // Xóa sản phẩm khỏi selectedItems nếu số lượng là 0
        setSelectedItems((prev) => prev.filter((id) => id !== productId));
        // Nếu đây là sản phẩm cuối cùng, đóng modal
        if (prev.length === 1) {
          setShowPaymentModal(false);
        }
      } else {
        // Cập nhật selectedItems nếu sản phẩm vẫn được chọn
        if (!selectedItems.includes(productId)) {
          setSelectedItems((prev) => [...prev, productId]);
        }
      }

      // Cập nhật cartItems và server nếu cần
      const item = cartItems.find((i) => i.productId === productId);
      if (item && newQty > 0) {
        updateCartQuantity(productId, newQty).then(() => fetchCart());
      } else if (newQty === 0) {
        handleRemoveItem(productId);
      }

      return updatedQuantities;
    });
  };

  const handleRemoveItem = async (productId) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      try {
        await removeFromCart(productId);
        await fetchCart();
        setSelectedItems((prev) => {
          const newSelected = prev.filter((id) => id !== productId);
          // Nếu không còn sản phẩm nào được chọn, đóng modal
          if (newSelected.length === 0) {
            setShowPaymentModal(false);
          }
          if (paginatedItems.length === 1 && currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
          return newSelected;
        });
        window.dispatchEvent(new Event('cartUpdated')); // Cập nhật số lượng trên icon ngay lập tức
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
      }
    }
  };

  const validateUserInfo = () => {
    const { email, fullname, numberphone, address } = userInfo;
    return email && fullname && numberphone && address;
  };

  const handleCheckout = () => {
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
      const validCartItems = cartItems.map((item) => ({
        ...item,
        quantity: modalQuantities[item.productId] || item.quantity,
      }));
      const selectedItemsWithQty = selectedItems.filter((id) => modalQuantities[id] > 0);
      const response = await processPayment(paymentMethod, selectedItemsWithQty, validCartItems);
      if (response.success) {
        if (paymentMethod === 'COD') {
          alert('Đặt hàng thành công! Chờ xác nhận từ cửa hàng.');
        } else if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        }
        setSelectedItems([]);
        await fetchCart();
      } else {
        alert(`Thanh toán thất bại: ${response.error}`);
      }
    } catch (err) {
      alert('Đã xảy ra lỗi khi xử lý thanh toán.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmVnpayPayment = async () => {
    alert('Thanh toán VNPAY thành công!');
    setSelectedItems([]);
    await fetchCart();
    setShowPaymentCode(false);
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
    exit: { x: -100, opacity: 0, transition: { duration: 0.3 } },
  };

  const cardHoverVariants = {
    hover: { y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', transition: { duration: 0.3 } },
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPages = Math.ceil(cartItems.length / itemsPerPage);
  const paginatedItems = cartItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalAmount = cartItems
    .filter((item) => selectedItems.includes(item.productId))
    .reduce((sum, item) => sum + ((modalQuantities[item.productId] || item.quantity) * item.pricePerUnit), 0);
  const cartTotalPrice = cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems((prev) =>
      prev.length === cartItems.length ? [] : cartItems.map((item) => item.productId)
    );
  };

  const handleSaveUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    setIsUserInfoValid(validateUserInfo());
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
    handleConfirmVnpayPayment,
    handleCopyCode,
    containerVariants,
    itemVariants,
    cardHoverVariants,
    setCurrentPage,
    setUserInfo,
    setShowPaymentOptions,
    setShowPaymentCode,
    setShowUserInfoModal,
    setVnpayCode,
    modalQuantities,
  };
};