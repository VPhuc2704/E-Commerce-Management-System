export const useAddressManager = (addresses, setAddresses, showNotification) => {
  const handleSetDefaultAddress = (id) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
    showNotification("Đã cập nhật địa chỉ mặc định!", "success");
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
      showNotification("Đã xóa địa chỉ thành công!", "success");
    }
  };

  const handleAddAddress = (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: Date.now(),
      isDefault: addresses.length === 0,
    };
    setAddresses([...addresses, addressWithId]);
    showNotification("Đã thêm địa chỉ mới!", "success");
  };

  return {
    handleSetDefaultAddress,
    handleDeleteAddress,
    handleAddAddress,
  };
};