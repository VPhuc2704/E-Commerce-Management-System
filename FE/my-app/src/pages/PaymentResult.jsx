import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const PaymentResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handlePaymentResult = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/vnpayment/return${location.search}`);
                const resultText = await response.text();

                const urlParams = new URLSearchParams(location.search);
                const orderId = urlParams.get("vnp_TxnRef");
                const responseCode = urlParams.get("vnp_ResponseCode");
                const transactionStatus = urlParams.get("vnp_TransactionStatus");

                // debug ra console
                console.log("== VNPay Callback ==");
                console.log("Query string:", location.search);
                console.log("TxnRef (Order ID):", orderId);
                console.log("Response Code:", responseCode);
                console.log("Transaction Status:", transactionStatus);
                console.log("Response OK (200):", response.ok);
                console.log("Server trả về:", resultText);

                if (response.ok && responseCode === "00" && transactionStatus === "00") {
                    console.log("Điều kiện thành công đúng — sẽ điều hướng tới:", `/order-details/${orderId}`);
                    navigate(`/order-details/${orderId}`);
                } else {
                    console.log("Điều kiện thất bại — sẽ về trang chủ");
                    navigate("/");
                }

            } catch (error) {
                console.error("Lỗi xử lý kết quả thanh toán:", error);
                navigate("/");
            }
        };

        handlePaymentResult();
    }, [location.search, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <div className="text-lg font-semibold mb-2">Đang xử lý thanh toán...</div>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
        </div>
    );
};

export default PaymentResult;
