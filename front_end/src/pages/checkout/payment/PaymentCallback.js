import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ApiService from '../../../services/ApiService';

const PaymentCallback = () => {
    const [status, setStatus] = useState('checking');
    const [message, setMessage] = useState('Đang kiểm tra thông tin thanh toán...');
    const [orderId, setOrderId] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

  useEffect(() => {
        const checkPaymentStatus = async () => {
            try {
                // Lấy thông tin từ localStorage
                const savedOrderId = localStorage.getItem('currentOrderId');
                const transactionCode = localStorage.getItem('payosTransactionCode');

                if (!savedOrderId || !transactionCode) {
                    setStatus('error');
                    setMessage('Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.');
                    return;
                }

                setOrderId(savedOrderId);

                // Gọi API kiểm tra trạng thái thanh toán
                const statusResponse = await ApiService.get(`/payos/check-status/${transactionCode}`);

                // Xử lý khi API trả về 308 Redirect (URL đã thay đổi vĩnh viễn)
                if (statusResponse.status === 308) {
                    setStatus('error');
                    setMessage('Hệ thống thanh toán đang bảo trì. Vui lòng liên hệ hỗ trợ.');
                    return;
                }

                // Kiểm tra dữ liệu trả về
                if (statusResponse.data?.payment?.status === 'PAID') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Đang chuyển hướng...');

                    // Tự động chuyển hướng sau 2 giây
                    setTimeout(() => {
                        navigate(`/order-confirmation?orderId=${savedOrderId}`);
                    }, 2000);

                } else if (statusResponse.data?.payment?.status === 'PENDING') {
                    setStatus('pending');
                    setMessage('Thanh toán đang chờ xử lý. Vui lòng kiểm tra tài khoản ngân hàng.');

                } else {
                    setStatus('failed');
                    setMessage('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức khác.');
                }

            } catch (error) {
                console.error('Lỗi khi kiểm tra thanh toán:', error);
                setStatus('error');
                setMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            }
        };

        checkPaymentStatus();

        // Dọn dẹp localStorage khi component unmount
        return () => {
            localStorage.removeItem('currentOrderId');
            localStorage.removeItem('payosTransactionCode');
        };
    }, [navigate]);

    // Các style và hiển thị theo trạng thái
    const getStatusColor = () => {
        switch (status) {
            case 'success': return 'text-green-600';
            case 'pending': return 'text-yellow-600';
            case 'failed': return 'text-red-600';
            case 'error': return 'text-red-600';
            default: return 'text-blue-600';
        }
    };

    const getIcon = () => {
        switch (status) {
            case 'success': return '✓';
            case 'pending': return '⏳';
            case 'failed': return '✗';
            case 'error': return '⚠';
            default: return '🔄';
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 m-4 bg-white rounded-lg shadow-lg">
                <div className={`text-6xl text-center mb-4 ${getStatusColor()}`}>
                    {getIcon()}
                </div>
                <h1 className="text-2xl font-bold text-center mb-4">
                    Kết quả thanh toán
                </h1>
                <p className={`text-center mb-6 ${getStatusColor()}`}>
                    {message}
                </p>
                
                {status === 'failed' && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => navigate('/checkout')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                        >
                            Quay lại thanh toán
                        </button>
                        
                        {orderId && (
                            <button
                                onClick={() => navigate(`/order-confirmation?orderId=${orderId}`)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
                            >
                                Xem đơn hàng
                            </button>
                        )}
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Về trang chủ
                        </button>
                    </div>
                )}
                
                {(status === 'checking' || status === 'success' || status === 'pending') && (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentCallback;