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
        const queryParams = new URLSearchParams(location.search);
        const urlOrderId = queryParams.get("orderId");
        const urlTransactionCode = queryParams.get("transactionCode");
        
        console.log('URL Params:', { urlOrderId, urlTransactionCode, search: location.search });

        const savedOrderId = localStorage.getItem('currentOrderId');
        const savedTransactionCode = localStorage.getItem('paymentTransactionCode');
        
        console.log('LocalStorage data:', { savedOrderId, savedTransactionCode });

        const finalOrderId = urlOrderId || savedOrderId;
        const finalTransactionCode = urlTransactionCode || savedTransactionCode;

        if (!finalOrderId || !finalTransactionCode) {
          console.warn("Missing orderId or transactionCode");
          setStatus('error');
          setMessage('Không tìm thấy thông tin đơn hàng. Vui lòng thử lại.');
          return;
        }

        setOrderId(finalOrderId);

        console.log('Checking payment status with:', { orderId: finalOrderId, transactionCode: finalTransactionCode });

        const statusResponse = await ApiService.get(`/payos/check-status/${finalTransactionCode}`);
        console.log('Payment status response:', statusResponse);

        // Kiểm tra dữ liệu trả về từ API một cách an toàn
        if (!statusResponse || typeof statusResponse !== 'object') {
          throw new Error('Invalid response format from payment status API');
        }

        if (!statusResponse.success || !statusResponse.data || !statusResponse.data.payment || !statusResponse.data.payment.status) {
          throw new Error('Invalid response structure from payment status API');
        }

        const paymentStatus = statusResponse.data.payment.status;

        if (paymentStatus === 'PAID' || paymentStatus === 'SUCCESS') {
          setStatus('success');
          setMessage('Thanh toán thành công! Đang chuyển hướng...');
          localStorage.removeItem('currentOrderId');
          localStorage.removeItem('paymentTransactionCode');
          setTimeout(() => {
            navigate(`/order-confirmation?orderId=${finalOrderId}`);
          }, 2000);
        } else if (paymentStatus === 'PENDING' || paymentStatus === 'PROCESSING') {
          setStatus('pending');
          setMessage('Thanh toán đang chờ xử lý. Vui lòng kiểm tra tài khoản ngân hàng.');
        } else if (paymentStatus === 'FAILED' || paymentStatus === 'CANCELLED') {
          setStatus('failed');
          setMessage('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức khác.');
        } else {
          console.warn('Unknown payment status:', paymentStatus);
          setStatus('error');
          setMessage('Không thể xác định trạng thái thanh toán. Vui lòng liên hệ hỗ trợ.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
        if (error.response) {
          console.error('API Error Response:', error.response.data);
          if (error.response.status === 404) {
            setMessage('Không tìm thấy thông tin giao dịch. Vui lòng liên hệ hỗ trợ.');
          } else if (error.response.status === 500) {
            setMessage('Lỗi hệ thống. Vui lòng thử lại sau.');
          } else {
            setMessage(`Lỗi API: ${error.response.data?.message || error.message}`);
          }
        } else if (error.request) {
          setMessage('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } else {
          setMessage(`Đã xảy ra lỗi: ${error.message || 'Không xác định'}`);
        }
      }
    };

    checkPaymentStatus();

    return () => {
      if (status === 'success' || status === 'error') {
        localStorage.removeItem('currentOrderId');
        localStorage.removeItem('paymentTransactionCode');
      }
    };
  }, [navigate, location, status]);

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

  const handleRetryPayment = () => {
    console.log('Handling retry payment');
    localStorage.removeItem('currentOrderId');
    localStorage.removeItem('paymentTransactionCode');
    navigate('/checkout');
  };

  const handleGoHome = () => {
    console.log('Handling go home');
    localStorage.removeItem('currentOrderId');
    localStorage.removeItem('paymentTransactionCode');
    navigate('/');
  };

  const handleViewOrder = () => {
    console.log('Handling view order');
    if (orderId) {
      navigate(`/order-confirmation?orderId=${orderId}`);
    } else {
      console.warn('Order ID is missing for view order');
      setMessage('Không tìm thấy mã đơn hàng để xem chi tiết.');
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

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 p-2 rounded mb-4 text-xs">
            <p>Order ID: {orderId || 'N/A'}</p>
            <p>Status: {status}</p>
            <p>URL: {location.search}</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleRetryPayment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Thử lại thanh toán
            </button>
            {orderId && (
              <button
                onClick={handleViewOrder}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Xem đơn hàng
              </button>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleGoHome}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Về trang chủ
            </button>
            {orderId && (
              <button
                onClick={handleViewOrder}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Xem đơn hàng
              </button>
            )}
          </div>
        )}

        {status === 'pending' && (
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              Kiểm tra lại
            </button>
            {orderId && (
              <button
                onClick={handleViewOrder}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Xem đơn hàng
              </button>
            )}
          </div>
        )}

        {(status === 'checking' || status === 'success') && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;