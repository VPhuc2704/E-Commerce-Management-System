import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';

const VerifyPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async (token) => {
            try {
                const response = await fetch(`http://localhost:8081/api/auth/verify?token=${token}`, {
                    method: 'POST',
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Xác thực thất bại');
                }

                setMessage(data.message || "Xác thực thành công! Bạn có thể đăng nhập.");
                setStatus('success');
                
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setMessage(error.message || "Có lỗi xảy ra khi xác thực.");
                setStatus('error');
                
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            toastMessage: error.message,
                            toastType: 'error',
                        },
                    });
                }, 5000);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            // Thêm delay để tạo hiệu ứng loading
            setTimeout(() => {
                verifyEmail(token);
            }, 1500);
        } else {
            setMessage("Token không hợp lệ hoặc không tồn tại.");
            setStatus("error");
            setLoading(false);
        }
    }, [token, navigate]);

    const getStatusIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />;
            case 'error':
                return <XCircle className="w-16 h-16 text-red-500 animate-pulse" />;
            default:
                return <Mail className="w-16 h-16 text-gray-400" />;
        }
    };

    const getStatusMessage = () => {
        if (loading && status === 'loading') {
            return "Đang xác thực tài khoản...";
        }
        return message;
    };

    const getStatusColor = () => {
        switch (status) {
            case 'loading':
                return 'text-blue-600';
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getBackgroundGradient = () => {
        switch (status) {
            case 'success':
                return 'from-green-50 via-blue-50 to-purple-50';
            case 'error':
                return 'from-red-50 via-orange-50 to-yellow-50';
            default:
                return 'from-blue-50 via-indigo-50 to-purple-50';
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} flex items-center justify-center p-4 transition-all duration-1000 ease-in-out`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Main content card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center transform transition-all duration-700 ease-out hover:scale-105">
                    {/* Icon container */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl transform scale-150"></div>
                            <div className="relative bg-white rounded-full p-4 shadow-lg">
                                {getStatusIcon()}
                            </div>
                        </div>
                    </div>

                    {/* Status message */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
                            Xác Thực Email
                        </h1>
                        <p className={`text-lg ${getStatusColor()} font-medium transition-colors duration-500`}>
                            {getStatusMessage()}
                        </p>
                    </div>

                    {/* Progress indicators */}
                    {status === 'loading' && (
                        <div className="mb-6">
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    )}

                    {/* Success countdown */}
                    {status === 'success' && (
                        <div className="mb-6 p-4 bg-green-50 rounded-2xl border border-green-200">
                            <p className="text-green-700 text-sm">
                                Đang chuyển hướng đến trang đăng nhập...
                            </p>
                            <div className="mt-2 w-full bg-green-200 rounded-full h-1 overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    )}

                    {/* Error state with retry option */}
                    {status === 'error' && (
                        <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-200">
                            <p className="text-red-700 text-sm mb-3">
                                Sẽ tự động chuyển về trang đăng nhập sau 5 giây
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quay lại đăng nhập
                            </button>
                        </div>
                    )}

                    {/* Decorative elements */}
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-60 animate-ping"></div>
                    <div className="absolute -top-1 -right-3 w-3 h-3 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full opacity-60 animate-ping delay-300"></div>
                    <div className="absolute -bottom-2 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-60 animate-ping delay-700"></div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Nếu bạn gặp vấn đề, vui lòng liên hệ hỗ trợ
                    </p>
                </div>
            </div>

            {/* Floating particles effect */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/60 rounded-full animate-float delay-1000"></div>
                <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-400/60 rounded-full animate-float delay-2000"></div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default VerifyPage;