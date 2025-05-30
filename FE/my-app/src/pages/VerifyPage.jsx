import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Toast from '../components/common/Toast';

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async (token) => {
            try {
                const response = await fetch(`http://localhost:8081/api/auth/verify?token=${token}`, {
                    method: 'POST',
                });

                // Đọc data TRƯỚC khi check response.ok
                const data = await response.json();

                if (!response.ok) {
                    // Nếu status không phải 2xx, show message lỗi backend trả về
                    throw new Error(data.message || 'Xác thực thành công! Bạn có thể đăng nhập.');
                }

                // Nếu thành công
                setToastMessage(data.message || "Xác thực thành công! Bạn có thể đăng nhập.");
                setToastType('success');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                setToastMessage(error.message || "Có lỗi xảy ra khi xác thực.");
                setToastType('error');
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            toastMessage: error.message,
                            toastType: 'error',
                        },
                    });
                }, 2000);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyEmail(token); // Đừng quên pass token vào function!
        } else {
            setToastMessage("Token không hợp lệ hoặc không tồn tại.");
            setToastType("error");
            setLoading(false);
        }
    }, [token, navigate]);

    return (
        <>
            {loading && <div>Đang xác thực...</div>}
            {toastMessage && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage('')}
                />
            )}
        </>
    );
};

export default VerifyPage;


// CÒN LỖI LOGIC tạm thời bỏ qua