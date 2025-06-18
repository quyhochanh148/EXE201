import React, { useState, useEffect } from 'react';
import {
  Store,
  CheckCircle,
  Upload,
  Info,
  Package,
  MapPin,
  FileText,
  CreditCard,
  AlertCircle,
  Loader,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import AuthService from '../services/AuthService';
// import leafBg from '../assets/leaf-bg.png';

const ShopRegistration = () => {
  const navigate = useNavigate();

  // State quản lý form
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    email: '',
    CCCD: '',
    address: '',
    description: '',
    logo: null,
    image_cover: null,
    identityCardFront: null,
    identityCardBack: null,
    businessLicense: null
  });

  // State cho file và preview
  const [logoFile, setLogoFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [identityFrontFile, setIdentityFrontFile] = useState(null);
  const [identityBackFile, setIdentityBackFile] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [identityFrontPreview, setIdentityFrontPreview] = useState(null);
  const [identityBackPreview, setIdentityBackPreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  const [identityCardFront, setIdentityCardFront] = useState(null);

  // State quản lý các bước đăng ký
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [terms, setTerms] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);

  // State cho tiến trình
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');

  // Component ProgressBar
  const ProgressBar = ({ percent, status }) => {
    if (percent === 0) return null;

    return (
      <div className="mb-4 perspective-1000">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-green-600">{status}</div>
          <div className="text-sm font-medium text-green-900">{percent}%</div>
        </div>
        <div className="w-full bg-green-200 rounded-full h-2.5 transform transition-all duration-300 hover:translateZ(5px)">
          <div
            className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Fetch user và categories
  useEffect(() => {
    const fetchUserAndCategories = async () => {
      try {
        if (!AuthService.isLoggedIn()) {
          navigate('/login', { state: { from: '/shop/register' } });
          return;
        }

        const userData = AuthService.getCurrentUser();
        setUser(userData);

        const email = userData.email || '';
        let username = email ? email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() : '';

        setFormData(prev => ({
          ...prev,
          email: email,
          phone: userData.phone || '',
          username: username
        }));

        setLoading(true);
        const categoriesData = await ApiService.get('/categories', false);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setCategories([
          { _id: "1", name: 'MÁY TÍNH & LAPTOP', count: 14 },
          { _id: "2", name: 'ĐỒNG HỒ', count: 10 },
          { _id: "3", name: 'THỜI TRANG NAM', count: 7 },
          { _id: "4", name: 'THỜI TRANG NỮ', count: 5 },
          { _id: "5", name: 'ĐỒ GIA DỤNG', count: 8 },
          { _id: "6", name: 'MẸ & BÉ', count: 6 },
          { _id: "7", name: 'MỸ PHẨM', count: 12 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndCategories();
  }, [navigate]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' && value) {
      const username = value.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      setFormData(prev => ({
        ...prev,
        [name]: value,
        username: username
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Xử lý chọn danh mục
  const handleCategorySelect = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Xử lý upload file
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files[0]) return;

    const file = files[0];
    const previewUrl = URL.createObjectURL(file);

    switch (name) {
      case 'logo':
        setLogoFile(file);
        setLogoPreview(previewUrl);
        break;
      case 'image_cover':
        setCoverFile(file);
        setCoverPreview(previewUrl);
        break;
      case 'identityCardFront':
        setIdentityFrontFile(file);
        setIdentityFrontPreview(previewUrl);
        break;
      case 'identityCardBack':
        setIdentityBackFile(file);
        setIdentityBackPreview(previewUrl);
        break;
      case 'businessLicense':
        setLicenseFile(file);
        setLicensePreview(previewUrl);
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = (fieldName) => {
    switch (fieldName) {
      case 'logo':
        setLogoFile(null);
        setLogoPreview(null);
        break;
      case 'image_cover':
        setCoverFile(null);
        setCoverPreview(null);
        break;
      case 'identityCardFront':
        setIdentityFrontFile(null);
        setIdentityFrontPreview(null);
        break;
      case 'identityCardBack':
        setIdentityBackFile(null);
        setIdentityBackPreview(null);
        break;
      case 'businessLicense':
        setLicenseFile(null);
        setLicensePreview(null);
        break;
      default:
        break;
    }

    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  // Upload ảnh shop
  const uploadShopImage = async (file, field, shopId) => {
    if (!file || !shopId) return null;

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('field', field);

      const response = await ApiService.uploadFile(`/shops/upload/${shopId}`, formData);

      if (response) {
        if (field === 'logo' && response.logo) return response.logo;
        if (field === 'image_cover' && response.image_cover) return response.image_cover;
        if (field === 'identity_card_image_front' && response.identity_card_image_front) return response.identity_card_image_front;
        if (field == 'identity_card_image_back' && response.identity_card_image_back) return response.identity_card_image_back;
        if (field === 'business_license' && response.business_license) return response.business_license;
        console.log('Response from upload:', response);
        return null;
      } else {
        throw new Error('URL hình ảnh không hợp lệ');
      }
    } catch (error) {
      console.error(`Lỗi upload ảnh ${field}:`, error);
      return null;
    }
  };

  // Xử lý chuyển bước
  const handleNextStep = () => {
    setError(null);

    if (currentStep === 1 && selectedCategories.length === 0) {
      setError('Vui lòng chọn ít nhất một danh mục sản phẩm');
      return;
    }

    if (currentStep === 2) {
      const requiredFields = ['name', 'phone', 'email', 'CCCD', 'address'];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        setError('Vui lòng điền đầy đủ các trường bắt buộc');
        return;
      }

      if (formData.email && (!formData.username || formData.username.trim() === '')) {
        const generatedUsername = formData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        setFormData(prev => ({
          ...prev,
          username: generatedUsername
        }));
      }

      const cccdRegex = /^\d{12}$/;
      if (!cccdRegex.test(formData.CCCD)) {
        setError('Số CCCD phải có đúng 12 chữ số');
        return;
      }

      const phoneRegex = /^(0[3-9])[0-9]{8}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError('Số điện thoại không hợp lệ. Phải có 10 chữ số và bắt đầu bằng 0');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Email không hợp lệ');
        return;
      }
    }

    if (currentStep === 3) {
      if (!identityFrontFile) {
        setError('Vui lòng tải lên ảnh mặt trước CMND/CCCD');
        return;
      }

      if (!identityBackFile) {
        setError('Vui lòng tải lên ảnh mặt sau CMND/CCCD');
        return;
      }

      if (!terms) {
        setError('Vui lòng đồng ý với điều khoản dịch vụ');
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    if (!AuthService.isLoggedIn()) {
      setError('Bạn cần đăng nhập để thực hiện chức năng này');
      navigate('/login', { state: { from: '/shop/register' } });
      return;
    }

    if (!identityFrontFile || !identityBackFile) {
      setError('Vui lòng tải lên cả ảnh mặt trước và mặt sau CMND/CCCD');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      setProgressStatus('Đang khởi tạo cửa hàng...');
      setProgressPercent(10);

      let usernameValue = formData.username || '';
      if (!usernameValue && formData.email) {
        usernameValue = formData.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      }

      const shopData = {
        name: formData.name,
        username: usernameValue,
        phone: formData.phone,
        email: formData.email,
        CCCD: formData.CCCD,
        address: formData.address,
        description: formData.description || '',
      };

      setProgressStatus('Đang tạo cửa hàng...');
      setProgressPercent(20);

      const response = await ApiService.post('/shops/create', shopData);

      if (!response || !response.shop || !response.shop._id) {
        throw new Error('Phản hồi từ server không hợp lệ hoặc thiếu thông tin shop');
      }

      const shopId = response.shop._id;
      let hasUploadError = false;

      setProgressStatus('Đang tải lên ảnh...');
      setProgressPercent(40);

      const uploadPromises = [];
      const uploadResults = {
        logoUrl: null,
        coverUrl: null,
        name: 'cover-image',
        value: null,
        identityFrontUrl: null,
        identityCardFront,
        name: 'identity-front',
        value: null,
        identityBackUrl: null,
        licenseUrl: null
      };

      if (logoFile) {
        uploadPromises.push(
          uploadShopImage(logoFile, 'logo', shopId)
            .then(url => { uploadResults.logoUrl = url; })
            .catch(err => {
              console.error('Error uploading logo:', err);
              hasUploadError = true;
            })
        );
      }

      if (coverFile) {
        uploadPromises.push(
          uploadShopImage(coverFile, 'image_cover', shopId)
            .then(url => { uploadResults.coverUrl = url; })
            .catch(err => {
              console.error('Error uploading cover image:', err);
              hasUploadError = true;
            })
        );
      }

      if (identityFrontFile) {
        uploadPromises.push(
          uploadShopImage(identityFrontFile, 'identity_card_image_front', shopId)
            .then(url => {
              uploadResults.identityFrontUrl = url;
              if (!url) hasUploadError = true;
            })
            .catch(err => {
              console.error('Error uploading identity front image:', err);
              hasUploadError = true;
            })
        );
      }

      if (identityBackFile) {
        uploadPromises.push(
          uploadShopImage(identityBackFile, 'identity_card_image_back', shopId)
            .then(url => {
              uploadResults.identityBackUrl = url;
              if (!url) hasUploadError = true;
            })
            .then(url => {
              uploadResults.identityBackUrl = url;
              if (!url) hasUploadError = true;
            })
            .catch(err => {
              console.error('Error uploading identity back image:', err);
              hasUploadError = true;
            })
        );
      }

      if (licenseFile) {
        uploadPromises.push(
          uploadShopImage(licenseFile, 'business_license', shopId)
            .then(url => { uploadResults.licenseUrl = url; })
            .catch(err => {
              console.error('Error uploading business license:', err);
            })
        );
      }

      await Promise.all(uploadPromises);

      setProgressStatus('Đang lưu danh mục...');
      setProgressPercent(80);

      if (shopId && selectedCategories.length > 0) {
        try {
          await ApiService.post(`/shop-categories/${shopId}`, { categoryIds: selectedCategories });
          console.log('Error saving shop categories');
        } catch (err) {
          console.error('Error saving shop categories:', err);
        }
      }

      setProgressStatus('Đang hoàn tất...');
      setProgressPercent(90);

      try {
        await AuthService.refreshUserInfo();
      } catch (refreshError) {
        console.error('Failed to refresh user info:', error);
      }

      setProgressPercent(100);
      setProgressStatus('Hoàn tất đăng ký!');
      setSuccess(true);

      if (hasUploadError) {
        setError('Cửa hàng đã được tạo nhưng có lỗi khi tải lên một số hình ảnh. Bạn có thể cập nhật sau trong trang "Cửa hàng của tôi".');
      }

      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error in shop registration:', error);

      const errorMessage = error && typeof error === 'object' && error.message ?
        error.message : 'Có lỗi xảy ra khi đăng ký cửa hàng';
      setError(errorMessage);

      if (error &&
        error &&
        typeof error === 'object' &&
        error.message && (
          error.message.includes('đăng nhập') ||
          error.message.includes('token') ||
          error.message.includes('Unauthorized'))) {
        setTimeout(() => {
          navigate('/login', { state: { from: '/shop/register' } });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  // Thông báo lỗi
  const renderError = () => {
    if (!error) return null;

    return (
      <div className="bg-red-300 border border-red-500 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-3 sm:mb-4 flex items-start animate-slide-in perspective-1000">
        <AlertCircle className="mr-2 flex-shrink-0 mt-0.5 transform hover:rotateY(10deg) w-4 h-4 sm:w-5 sm:h-5" />
        <span className="text-sm sm:text-base transform hover:translateZ(5px)">{error}</span>
      </div>
    );
  };

  // Thông báo thành công
  const renderSuccess = () => {
    if (!success) return null;

    return (
      <div className="bg-green-50 border border-green-500 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-3 sm:mb-4 flex items-start animate-slide-in perspective-1000">
        <CheckCircle className="mr-2 flex-shrink-0 mt-0.5 transform hover:rotateY(10deg) w-4 h-4 sm:w-5 sm:h-5" />
        <div className="transform hover:translateZ(5px)">
          <p className="font-medium text-sm sm:text-base">Đăng ký cửa hàng thành công!</p>
          <p className="text-xs sm:text-sm">Chúng tôi đang xem xét thông tin của bạn và sẽ liên hệ trong vòng 24h. Bạn sẽ được chuyển hướng về trang chủ sau 5 giây...</p>
        </div>
      </div>
    );
  };

  // Step 1: Chọn danh mục
  const renderCategorySelection = () => {
    return (
      <div className="mt-6 sm:mt-8 animate-slide-up perspective-1000">
        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3 sm:mb-4 transform hover:translateZ(10px)">Chọn danh mục sản phẩm bạn muốn bán</h2>
        <p className="text-sm sm:text-base text-emerald-600 mb-4 sm:mb-6 transform hover:translateZ(5px)">Bạn có thể chọn nhiều danh mục phù hợp với sản phẩm của mình</p>

        {loading && (
          <div className="flex justify-center items-center py-8 sm:py-10 animate-pulse">
            <Loader className="animate-spin text-emerald-600 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Đang tải danh mục...</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <div
              key={category._id}
              className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:rotateY(8deg) hover:shadow-emerald-400/50 animate-glowGreen
                ${selectedCategories.includes(category._id) ? 'border-emerald-500 bg-emerald-50' : 'border-emerald-200 hover:border-emerald-300'}`}
              onClick={() => handleCategorySelect(category._id)}
            >
              <div className="relative h-32 sm:h-40 mb-2 sm:mb-3 bg-emerald-100 flex items-center justify-center rounded transform hover:translateZ(10px)">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <Package size={32} className="sm:w-12 sm:h-12 text-emerald-400" />
                )}
                {selectedCategories.includes(category._id) && (
                  <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-emerald-600 text-white rounded-full p-1 animate-pulse">
                    <CheckCircle size={12} className="sm:w-4 sm:h-4" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-center text-gray-800 text-base sm:text-lg">{category.name}</h3>
              <p className="text-gray-500 text-xs sm:text-sm text-center">{category.count || 0} Sản phẩm</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Step 2: Thông tin cửa hàng
  const renderShopInfo = () => {
    return (
      <div className="mt-6 sm:mt-8 animate-slide-up perspective-1000">
        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3 sm:mb-4 transform hover:translateZ(10px)">Thông tin cửa hàng</h2>
        <p className="text-sm sm:text-base text-emerald-600 mb-4 sm:mb-6 transform hover:translateZ(5px)">Vui lòng điền đầy đủ thông tin cửa hàng của bạn</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Tên cửa hàng *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border-2 border-emerald-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-300 hover:shadow-emerald-400/50 animate-glowGreen"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Mô tả cửa hàng</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 text-sm sm:text-base border-2 border-emerald-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-300 hover:shadow-emerald-400/50 animate-glowGreen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border-2 border-emerald-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-300 hover:shadow-emerald-400/50 animate-glowGreen"
                required
                placeholder="Nhập 10 số, bắt đầu bằng số 0"
              />
              <p className="text-xs text-emerald-500 mt-1 transform hover:translateZ(5px)">Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border-2 border-emerald-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-300 hover:shadow-emerald-400/50 animate-glowGreen"
                required
              />
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Địa chỉ cửa hàng *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border-2 border-emerald-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-300 hover:shadow-emerald-400/50 animate-glowGreen"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Số CMND/CCCD *</label>
              <input
                type="text"
                name="CCCD"
                value={formData.CCCD}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border-2 border-emerald-500 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all duration-300 hover:shadow-emerald-400/50 animate-glowGreen"
                required
                placeholder="Nhập 12 chữ số"
              />
              <p className="text-xs text-emerald-500 mt-1 transform hover:translateZ(5px)">Số CCCD phải có đúng 12 chữ số</p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <h3 className="text-base sm:text-lg font-medium text-emerald-700 mb-3 sm:mb-4 transform hover:translateZ(10px)">Tải lên hình ảnh</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="perspective-1000">
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Logo cửa hàng</label>
              <div
                className="border-2 border-dashed border-emerald-500 rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-105 hover:rotateY(8deg) animate-glowGreen"
                onClick={() => document.getElementById('logo-upload').click()}
              >
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-h-32 sm:max-h-48 mx-auto mb-2 transform transition-all duration-300 hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage('logo');
                      }}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-1 transform hover:scale-90"
                    >
                      <X size={12} className="sm:w-4 sm:h-4" />
                    </button>
                    <p className="text-xs sm:text-sm text-emerald-600">Nhấp để thay đổi</p>
                  </div>
                ) : (
                  <div className="transform hover:translateZ(10px)">
                    <Upload className="mx-auto text-emerald-600 mb-2 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="text-xs sm:text-sm text-emerald-600">Kéo thả file hoặc click để tải lên</p>
                  </div>
                )}
                <input
                  id="logo-upload"
                  type="file"
                  name="logo"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="perspective-1000">
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover-translateZ(5px)">Ảnh bìa cửa hàng</label>
              <div
                className="border-2 border-dashed border-emerald-500 rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-105 hover:rotateY(8deg) animate-glowGreen"
                onClick={() => document.getElementById('cover-upload').click()}
              >
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="max-h-32 sm:max-h-48 mx-auto mb-2 transform transition-all duration-300 hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage('image_cover');
                      }}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-1 transform hover:scale-90"
                    >
                      <X size={12} className="sm:w-4 sm:h-4" />
                    </button>
                    <p className="text-xs sm:text-sm text-emerald-600">Nhấp để thay đổi</p>
                  </div>
                ) : (
                  <div className="transform hover:translateZ(10px)">
                    <Upload className="mx-auto text-emerald-600 mb-2 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="text-xs sm:text-sm text-emerald-600">Kéo thả file hoặc click để tải lên</p>
                  </div>
                )}
                <input
                  id="cover-upload"
                  type="file"
                  name="image_cover"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Giấy tờ và xác nhận
  const renderDocuments = () => {
    return (
      <div className="mt-6 sm:mt-8 animate-slide-up perspective-1000">
        <h2 className="text-lg sm:text-xl font-bold text-emerald-700 mb-3 sm:mb-4 transform hover:translateZ(10px)">Tải lên giấy tờ xác thực</h2>
        <p className="text-sm sm:text-base text-emerald-600 mb-4 sm:mb-6 transform hover:translateZ(5px)">Để đảm bảo tính xác thực, cung cấp các giấy tờ sau</p>

        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-emerald-700 mb-2 sm:mb-3 transform hover:translateZ(5px)">CMND/CCCD (bắt buộc)</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="perspective-1000">
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">
                Mặt trước CMND/CCCD <span className="text-red-600">*</span>
              </label>
              <div
                className="border-2 border-dashed border-emerald-500 rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-105 hover:rotateY(8deg) animate-glowGreen"
                onClick={() => document.getElementById('identity-front-upload').click()}
              >
                {identityFrontPreview ? (
                  <div className="relative">
                    <img
                      src={identityFrontPreview}
                      alt="Identity front preview"
                      className="max-h-32 sm:max-h-48 mx-auto mb-2 transform transition-all duration-300 hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage('identityCardFront');
                      }}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-1 transform hover:scale-90"
                    >
                      <X size={12} className="sm:w-4 sm:h-4" />
                    </button>
                    <p className="text-xs sm:text-sm text-emerald-600">Nhấp để thay đổi</p>
                  </div>
                ) : (
                  <div className="transform hover:translateZ(10px)">
                    <Upload className="mx-auto text-emerald-600 mb-2 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="text-xs sm:text-sm text-emerald-600 text-center">Tải lên ảnh mặt trước CMND/CCCD</p>
                    <p className="text-xs text-red-600 mt-1">Bắt buộc</p>
                  </div>
                )}
                <input
                  id="identity-front-upload"
                  type="file"
                  name="identityCardFront"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
              </div>
            </div>

            <div className="perspective-1000">
              <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">
                Mặt sau CMND/CCCD <span className="text-red-600">*</span>
              </label>
              <div
                className="border-2 border-dashed border-emerald-500 rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-105 hover:rotateY(8deg) animate-glowGreen"
                onClick={() => document.getElementById('identity-back-upload').click()}
              >
                {identityBackPreview ? (
                  <div className="relative">
                    <img
                      src={identityBackPreview}
                      alt="Identity back preview"
                      className="max-h-32 sm:max-h-48 mx-auto mb-2 transform transition-all duration-300 hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage('identityCardBack');
                      }}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-1 transform hover:scale-90"
                    >
                      <X size={12} className="sm:w-4 sm:h-4" />
                    </button>
                    <p className="text-xs sm:text-sm text-emerald-600">Nhấp để thay đổi</p>
                  </div>
                ) : (
                  <div className="transform hover:translateZ(10px)">
                    <Upload className="mx-auto text-emerald-600 mb-2 w-6 h-6 sm:w-8 sm:h-8" />
                    <p className="text-xs sm:text-sm text-emerald-600">Tải lên ảnh mặt sau CMND/CCCD</p>
                    <p className="text-xs text-red-600 mt-1">Bắt buộc</p>
                  </div>
                )}
                <input
                  id="identity-back-upload"
                  type="file"
                  name="identityCardBack"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-emerald-700 mb-2 sm:mb-3 transform hover:translateZ(5px)">Giấy phép kinh doanh (không bắt buộc)</h3>
          <div className="perspective-1000">
            <label className="block text-sm font-medium text-emerald-700 mb-1 transform hover:translateZ(5px)">Giấy phép kinh doanh (nếu có)</label>
            <div
              className="border-2 border-dashed border-emerald-500 rounded-lg p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-105 hover:rotateY(8deg) animate-glowGreen"
              onClick={() => document.getElementById('license-upload').click()}
            >
              {licensePreview ? (
                <div className="relative">
                  <img
                    src={licensePreview}
                    alt="License preview"
                    className="max-h-32 sm:max-h-48 mx-auto mb-2 transform transition-all duration-300 hover:scale-110"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage('businessLicense');
                    }}
                    className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-white rounded-full p-1 transform hover:scale-90"
                  >
                    <X size={12} className="sm:w-4 sm:h-4" />
                  </button>
                  <p className="text-xs sm:text-sm text-emerald-600">Nhấp để thay đổi</p>
                </div>
              ) : (
                <div className="transform hover:translateZ(10px)">
                  <Upload className="mx-auto text-emerald-600 mb-2 w-6 h-6 sm:w-8 sm:h-8" />
                  <p className="text-xs sm:text-sm text-emerald-600">Kéo thả file hoặc click để tải lên</p>
                </div>
              )}
              <input
                id="license-upload"
                type="file"
                name="businessLicense"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf"
              />
            </div>
          </div>
        </div>

        <div className="bg-yellow-100 border border-yellow-500 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-start">
            <Info className="text-yellow-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 transform hover:scale-110 w-4 h-4 sm:w-5 sm:h-5" />
            <div className="transform hover:translateZ(5px)">
              <h4 className="font-medium text-emerald-800 text-sm sm:text-base">Lưu ý quan trọng</h4>
              <ul className="list-disc pl-4 sm:pl-5 mt-2 text-xs sm:text-sm text-emerald-700 space-y-1">
                <li>Các thông tin và giấy tờ của bạn sẽ được bảo mật tuyệt đối</li>
                <li>Ảnh CMND/CCCD phải rõ nét, đủ thông tin cả mặt trước và mặt sau</li>
                <li>Quá trình xét duyệt có thể mất từ 1-3 ngày làm việc</li>
                <li>Nếu thông tin không chính xác, đơn đăng ký của bạn có thể bị từ chối</li>
                <li>Sau khi được phê duyệt, bạn có thể bắt đầu đăng bán sản phẩm</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t pt-4 sm:pt-6">
          <div className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={terms}
              onChange={() => setTerms(!terms)}
              className="mt-1 mr-2 sm:mr-3 border-emerald-500"
            />
            <span className="text-xs sm:text-sm text-emerald-700 transform hover:translateZ(5px)">
              Tôi đã đọc và đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và{' '}
              <a href="#" className="text-blue-600 hover:underline">Chính sách bán hàng</a> của GreenGarden. Tôi cam kết tuân thủ các quy định về bán hàng và chịu trách nhiệm về các sản phẩm đăng bán.
            </span>
          </div>

          {progressPercent > 0 && (
            <div className="mt-3 sm:mt-4">
              <ProgressBar percent={progressPercent} status={progressStatus} />
            </div>
          )}
        </div>
      </div>
    );
  };
  // Hiển thị bước chỉ dẫn
  const renderStepIndicators = () => {
    const steps = [
      { number: 1, title: 'Danh mục', icon: Package, width: 1 },
      { number: 2, title: 'Thông tin', icon: Store, width: 2 },
      { number: 3, title: 'Tài liệu', icon: FileText, width: 3 }
    ];

    return (
      <div className="flex justify-center mb-6 sm:mb-10 perspective-1000">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-110 hover:rotateY(10deg)">
              <div
                className={`
                  w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                  ${currentStep >= step.number ? 'bg-emerald-600 text-white' : 'bg-emerald-200 text-emerald-600'}
                  animate-pulse shadow-emerald-400/50
                `}
              >
                <step.icon size={16} className="sm:w-6 sm:h-6" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-emerald-600 mt-1 sm:mt-2 transform hover-translateZ(5px)">{step.title}</div>
            </div>

            {index < steps.length - 1 && (
              <div className="w-8 sm:w-20 md:w-32 h-1 mt-4 sm:mt-5 mx-1 sm:mx-2 bg-emerald-100">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: currentStep > step.width ? '100%' : '0%' }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Main render
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8 relative z-10">
        <div className="text-center mb-4 sm:mb-8 animate-slide-in perspective-1000">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700 flex items-center justify-center gap-2">
            <span>Đăng ký trở thành người bán trên GreenGarden</span>
            <span className="text-amber-500 animate-bounce">🌱</span>
          </h3>
          <p className="text-amber-800 italic text-base mt-2">Gieo mầm xanh – Lan tỏa sức sống</p>
          <p className="text-gray-700 mt-2">Tiếp cận hàng triệu khách hàng và phát triển kinh doanh của bạn</p>
        </div>

        {renderStepIndicators()}

        {success ? (
          renderSuccess()
        ) : (
          <div className="bg-white shadow-md rounded-2xl border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8 animate-slide-up perspective-1000">
            {renderError()}
            <div className="transform transition-all duration-300" style={{ transform: `rotateX(${currentStep === 1 ? '0deg' : '45deg'})`, opacity: currentStep === 1 ? 1 : 0 }}>
              {currentStep === 1 && renderCategorySelection()}
            </div>
            <div className="transform transition-all duration-300" style={{ transform: `rotateX(${currentStep === 2 ? '0deg' : '45deg'})`, opacity: currentStep === 2 ? 1 : 0 }}>
              {currentStep === 2 && renderShopInfo()}
            </div>
            <div className="transform transition-all duration-300" style={{ transform: `rotateX(${currentStep === 3 ? '0deg' : '45deg'})`, opacity: currentStep === 3 ? 1 : 0 }}>
              {currentStep === 3 && renderDocuments()}
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-10 perspective-1000">
              <button
                type="button"
                onClick={handlePrevStep}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 border-lime-300 rounded-full text-emerald-700 font-semibold transition-all duration-200 bg-gradient-to-r from-lime-100 to-amber-50 shadow flex items-center gap-2 ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:from-lime-200 hover:to-yellow-100 hover:scale-105'}`}
                disabled={currentStep === 1 || loading}
              >
                <span className="text-amber-500 animate-wiggle">🌿</span> Quay lại
              </button>
              <button
                type="button"
                onClick={() => handleNextStep()}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-lime-300 to-amber-200 text-emerald-900 font-semibold rounded-full flex items-center justify-center shadow hover:from-lime-400 hover:to-yellow-200 transition-all duration-300 gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin loading-spinner w-4 h-4 sm:w-5 sm:h-5 mr-2" name="loading-spinner" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {currentStep === 3 ? 'Đăng ký cửa hàng' : 'Tiếp tục'} <span className="text-amber-500 animate-wiggle">🌱</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-lime-100 shadow-md p-4 sm:p-6 mb-6 animate-slide-up perspective-1000">
          <h3 className="text-base sm:text-lg font-bold text-emerald-700 mb-4 flex items-center gap-2"><span>Lợi ích khi bán hàng trên GreenGarden</span> <span className="text-amber-500 animate-bounce">🌿</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-start bg-white rounded-xl border border-lime-100 shadow p-4 gap-3">
              <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                <Store className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-emerald-700 font-semibold flex items-center gap-1">Tiếp cận khách hàng <span className="text-amber-500">🌱</span></h4>
                <p className="text-gray-600 text-sm">Kết nối với hàng triệu khách hàng tiềm năng trên nền tảng của chúng tôi</p>
              </div>
            </div>
            <div className="flex items-start bg-white rounded-xl border border-lime-100 shadow p-4 gap-3">
              <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                <MapPin className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-emerald-700 font-semibold flex items-center gap-1">Mở rộng thị trường <span className="text-amber-500">🌿</span></h4>
                <p className="text-gray-600 text-sm">Bán hàng toàn quốc không giới hạn địa lý, mở rộng thị trường của bạn</p>
              </div>
            </div>
            <div className="flex items-start bg-white rounded-xl border border-lime-100 shadow p-4 gap-3">
              <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
                <CreditCard className="text-emerald-600" />
              </div>
              <div>
                <h4 className="text-emerald-700 font-semibold flex items-center gap-1">Thanh toán an toàn <span className="text-amber-500">🌱</span></h4>
                <p className="text-gray-600 text-sm">Hệ thống thanh toán bảo mật, đảm bảo quyền lợi cho người bán</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx="true">{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(10deg); }
          }
          .animate-wiggle { animation: wiggle 1s infinite; }
        `}</style>
      </div>
    </div>
  );
}


export default ShopRegistration;