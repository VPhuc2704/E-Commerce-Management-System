import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Toast from '../components/common/Toast';
const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await fetch(`http://localhost:8081/api/auth/verify?token=${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (!res.ok) throw new Error(data.message || 'Xác thực thất bại');

                // Chuyển ngay sang trang login và truyền thông báo qua state
                navigate('/login', { state: { toastMessage: "Xác thực thành công! Bạn có thể đăng nhập." } });
            } catch (error) {
                // Nếu lỗi, hiển thị lỗi trên trang VerifyPage luôn (không chuyển trang)
                alert(error.message || "Có lỗi xảy ra khi xác thực.");
            }
        };

        if (token) verifyEmail();
    }, [token, navigate]);

    return (
        <div>
            Đang xác thực tài khoản...
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage('')}
            />
        </div>
    );
};
export default VerifyPage;