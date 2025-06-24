import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword, sendForgotPassword, verifyToken } from "../../services/authService";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: Code input, 3: New password
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    return newErrors;
  };

  const validateCode = () => {
    const newErrors = {};
    if (!formData.code.trim()) newErrors.code = "Mã xác minh là bắt buộc";
    else if (!/^\d{6}$/.test(formData.code)) newErrors.code = "Mã phải có 6 chữ số";
    return newErrors;
  };

  const validateNewPassword = () => {
    const newErrors = {};
    if (!formData.newPassword.trim()) newErrors.newPassword = "Mật khẩu mới là bắt buộc";
    else if (formData.newPassword.length < 6) newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Mật khẩu không khớp";
    return newErrors;
  };

  const sendVerificationCode = async (e) => {
    e.preventDefault();
    const validationErrors = validateEmail();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const res = await sendForgotPassword(formData.email);
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
        setErrors({});
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({ submit: error.message });
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    const validationErrors = validateCode();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const token = await verifyToken(formData.code);
      // Store token in memory instead of localStorage for security
      window.resetToken = token;
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({ submit: error.message || "Mã xác minh không hợp lệ. Thử lại." });
    }
  };

  const handlerResetPassword = async (e) => {
    e.preventDefault();
    const validationErrors = validateNewPassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = window.resetToken;
    if (!token) {
      setErrors({ submit: "Token không tồn tại hoặc đã hết hạn. Vui lòng thử lại." });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      setTimeout(() => {
        setIsLoading(false);
        delete window.resetToken;
        navigate("/login", { 
          state: { toastMessage: "Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới." }
        });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      setErrors({ submit: error.message || "Đặt lại mật khẩu thất bại" });
    }
  };

  const handleContinueWith = () => {
    console.log("Tiếp tục với Google");
    // Placeholder for Google OAuth login
  };

  const getStepTitle = () => {
    switch(step) {
      case 1: return "Quên Mật Khẩu";
      case 2: return "Xác Minh Email";
      case 3: return "Đặt Lại Mật Khẩu";
      default: return "Quên Mật Khẩu";
    }
  };

  const getStepDescription = () => {
    switch(step) {
      case 1: return "Nhập email của bạn để nhận mã xác minh";
      case 2: return "Kiểm tra email và nhập mã 6 chữ số";
      case 3: return "Tạo mật khẩu mới an toàn";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className={`w-full max-w-md relative transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
          
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg animate-bounce">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 7C13.4 7 14.8 8.6 14.8 10V11H16V18H8V11H9.2V10C9.2 8.6 10.6 7 12 7M12 8.2C11.2 8.2 10.4 8.7 10.4 10V11H13.6V10C13.6 8.7 12.8 8.2 12 8.2Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{getStepTitle()}</h1>
            <p className="text-gray-300">{getStepDescription()}</p>
            
            {/* Step indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-8 h-2 rounded-full transition-all duration-300 ${
                    i === step 
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                      : i < step 
                        ? 'bg-green-500' 
                        : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={step === 1 ? sendVerificationCode : step === 2 ? verifyCode : handlerResetPassword} className="space-y-6">
            {errors.submit && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl backdrop-blur-sm animate-shake">
                <p className="text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Địa chỉ Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
              </div>
            )}

            {/* Step 2: Code Input */}
            {step === 2 && (
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-2">Mã Xác Minh</label>
                <div className="relative">
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    disabled={isLoading}
                    maxLength="6"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15 text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                </div>
                {errors.code && <p className="mt-1 text-sm text-red-400">{errors.code}</p>}
                <p className="text-xs text-gray-400 mt-2">Không nhận được mã? Kiểm tra thư mục spam hoặc thử lại.</p>
              </div>
            )}

            {/* Step 3: New Password Inputs */}
            {step === 3 && (
              <>
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mật Khẩu Mới</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      placeholder="Nhập mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                  </div>
                  {errors.newPassword && <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Xác Nhận Mật Khẩu</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 group-hover:bg-white/15"
                      placeholder="Xác nhận mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300"></div>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </div>
              ) : (
                step === 1 ? "Gửi Mã Xác Minh" : 
                step === 2 ? "Xác Minh Mã" : 
                "Đặt Lại Mật Khẩu"
              )}
            </button>
          </form>

          {/* Divider - Only show on step 1 */}
          {step === 1 && (
            <>
              <div className="my-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-slate-900/50 text-gray-400">Hoặc tiếp tục với</span>
                  </div>
                </div>
              </div>

              {/* Google Button */}
              <button
                onClick={handleContinueWith}
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.419 24 c0 1.24 0 0h48l48H0z0"/>
                </svg>
                Tiêu tục với Google
              </button>
            </>
          )}

          {/* Back to Login */}
          <p className="mt-6 text-center text-gray-300">
            Nhớ mật khẩu của bạn?{' '}
            <Link
              to="/login"
              className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors"
            >
              Quay lại Đăng Nhập
            </Link>
          </p>

          {/* Resend Code Option - Chỉ hiện ở bước 2 */}
          {step === 2 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setStep(1);
                  setErrors({});
                }}
                className="text-sm text-gray-400 hover:text-purple-400 transition-colors hover:underline"
              >
                Không nhận được mã? Thử lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;