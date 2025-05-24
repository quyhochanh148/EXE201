import React from 'react';
import { Link } from 'react-router-dom'; // Nếu bạn dùng React Router cho liên kết
const IntroductionSection = () => {
    return (
        <div className="bg-white py-8">
            <div className="mx-auto max-w-7xl px-4">
                <div className="flex items-center justify-center mb-4">
                    <h2 className="text-lg font-bold text-red-500">Giới thiệu</h2>
                </div>
                <div className="bg-red-500 h-[4px] my-2"></div>
                <div className="text-gray-800">
                    <p className="mb-4 font-bold">Giới thiệu về công ty</p>
                    <p className="mb-4">
                        Được thành lập vào ngày 22/04/2002, <strong>Công ty TNHH Hạt Giống Hoa Việt Nam – FVN</strong> hiện đang được biết đến là một trong những nhà cung cấp hạt giống hoa nhập khẩu uy tín và chất lượng nhất hiện nay. Giấy chứng nhận đăng ký kinh doanh số 0302603082 do Sở Kế Hoạch Đầu tư Thành phố Hồ Chí Minh cấp.
                    </p>
                    <p className="mb-4">
                        Công ty có văn phòng chính tại TP. Hồ Chí Minh, nơi lưu trữ hàng hóa nhập khẩu, đóng gói và phân phối hạt giống cho hầu hết các thị trường trong cả nước. Với đội ngũ nhân viên đào tạo chuyên sâu, chúng tôi luôn đem đến cho quý khách hàng những sản phẩm với chất lượng phục vụ tốt nhất. Ngoài văn phòng chính, <strong>FVN</strong> có một trụ sở tại TP. Đà Lạt và hệ thống các vườn ươm được đầu tư chuyên nghiệp, mang đến cho khách hàng những sản phẩm cây giống chất lượng vượt trội. Năm 2017, <strong>FVN</strong> mở rộng quy mô về các tỉnh Miền Tây, xây dựng thêm trại sản xuất tại Tỉnh Tiền Giang nhằm đáp ứng tốt nhất nhu cầu cây giống cho khách hàng.
                    </p>
                    <div className="my-4">
                        <img
                            src="http://floralseedvn.com/contents_hatgiongvietnam/images/2.jpg"
                            alt="Công ty FVN"
                            className="w-full max-w-3xl mx-auto h-auto rounded-lg"
                        />
                    </div>
                    <p className="mb-4 font-bold">Sản phẩm kinh doanh</p>
                    <ul className="list-disc list-inside mb-4">
                        <li>Nhập khẩu và phân phối hạt giống hoa các loại.</li>
                        <li>Nhập khẩu và phân phối hạt giống rau củ quả (Dưa hấu, Dưa leo, Ớt).</li>
                        <li>Nhập khẩu và phân phối độc quyền sản phẩm giá thể Klasmann.</li>
                        <li>Sản xuất và mua bán cây giống hoa Cát tường và một số loại hoa khác.</li>
                        <li>Phân phối các sản phẩm vật tư nông nghiệp có liên quan.</li>
                    </ul>
                    <p className="mb-4 font-bold">Tầm nhìn:</p>
                    <p className="mb-4">
                        Trở thành nhà cung cấp các sản phẩm hạt giống hoa, cây giống hàng đầu Việt Nam.<br />
                        Xây dựng hệ thống nhân viên chăm sóc khách hàng theo từng khu vực.<br />
                        Mở rộng hệ thống Đại lý phân phối sản phẩm trên phạm vi cả nước.
                    </p>
                    <p className="mb-4 font-bold">Liên hệ</p>
                    <p className="mb-4">
                        <strong>Trụ sở chính:</strong><br />
                        31/78 Phan Huy Ích, Phường 15, Quận Tân Bình, TP.HCM<br />
                        Điện thoại: 028-54272155<br />
                        Email: fvnoffice@gmail.com
                    </p>
                    <p className="mb-4">
                        <strong>Tại Đà Lạt:</strong><br />
                        Thôn Đa Thọ, Xã Xuân Thọ, TP. Đà Lạt, Tỉnh Lâm Đồng
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IntroductionSection;