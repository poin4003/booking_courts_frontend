import React, { useEffect, useState } from 'react';
import { courtRepo } from '../api/features/CourtRepo';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('all');
  // Thêm state để theo dõi ảnh đang hiển thị cho mỗi sân
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const response = await courtRepo.getCourts();
      const courtsData = response.metadata || [];
      
      // Khởi tạo currentImageIndex cho mỗi sân
      const imageIndexMap = {};
      courtsData.forEach(court => {
        imageIndexMap[court._id] = 0;
      });
      setCurrentImageIndex(imageIndexMap);
      
      setCourts(courtsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching courts:', err);
      setError('Không thể tải danh sách sân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển ảnh tiếp theo
  const nextImage = (courtId, imagesLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [courtId]: (prev[courtId] + 1) % imagesLength
    }));
  };

  // Hàm chuyển ảnh trước đó
  const prevImage = (courtId, imagesLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [courtId]: (prev[courtId] - 1 + imagesLength) % imagesLength
    }));
  };

  // Hàm chuyển đến ảnh cụ thể
  const goToImage = (courtId, index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [courtId]: index
    }));
  };

  const courtTypes = [
    { id: 'all', label: 'Tất cả' },
    { id: 'football', label: 'Bóng đá' },
    { id: 'basketball', label: 'Bóng rổ' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'volleyball', label: 'Bóng chuyền' },
  ];

  const displayCourts = activeType === 'all' 
    ? courts 
    : courts.filter(court => court.sport_types && court.sport_types.includes(activeType));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Danh sách sân thể thao</h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Tìm và đặt sân phù hợp cho hoạt động thể thao của bạn
        </p>
      </div>

      {/* Search Box */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Loại sân</label>
              <select 
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                onChange={(e) => setActiveType(e.target.value)}
                value={activeType}
              >
                {courtTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Nhập địa điểm của bạn"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Ngày</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="date"
                  className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                className="bg-emerald-600 py-3 px-5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm">
          {courtTypes.map(type => (
            <button
              key={type.id}
              className={`
                px-4 py-2 text-sm font-medium 
                ${activeType === type.id ? 'bg-emerald-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'} 
                border border-gray-200 
                ${courtTypes.indexOf(type) === 0 ? 'rounded-l-md' : ''} 
                ${courtTypes.indexOf(type) === courtTypes.length - 1 ? 'rounded-r-md' : ''}
              `}
              onClick={() => setActiveType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courts Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <div className="col-span-3 flex justify-center py-10">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
          </div>
        )}
        
        {error && (
          <div className="col-span-3 text-center py-10">
            <div className="text-red-500 text-lg">{error}</div>
            <button 
              onClick={fetchCourts}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && displayCourts.length === 0 && (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500 text-lg">Không tìm thấy sân nào phù hợp với tiêu chí của bạn.</p>
          </div>
        )}

        {!loading && !error && displayCourts.map((court) => (
          <div key={court._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
            {/* Image Carousel */}
            <div className="relative h-48 group">
              {/* Hiển thị ảnh hiện tại với transition */}
              <div className="h-full overflow-hidden">
                {court.images && court.images.length > 0 ? (
                  <img
                    src={court.images[currentImageIndex[court._id]]}
                    alt={court.name}
                    className="w-full h-full object-cover transition-all duration-300 ease-in-out"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=Lỗi+hình+ảnh';
                    }}
                  />
                ) : (
                  <img
                    src="https://via.placeholder.com/400x300?text=Không+có+hình+ảnh"
                    alt={court.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              {/* Nút điều hướng chỉ hiển thị khi có nhiều hơn 1 ảnh và khi hover */}
              {court.images && court.images.length > 1 && (
                <>
                  {/* Nút Previous - ẩn mặc định, hiển thị khi hover */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage(court._id, court.images.length);
                    }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-1 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  {/* Nút Next - ẩn mặc định, hiển thị khi hover */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage(court._id, court.images.length);
                    }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-1 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {/* Indicator dots - luôn hiển thị */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {court.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          goToImage(court._id, index);
                        }}
                        className={`h-2 w-2 rounded-full focus:outline-none transition-colors duration-200 ${
                          index === currentImageIndex[court._id] ? 'bg-white' : 'bg-black bg-opacity-50'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              {court.sport_types && court.sport_types.length > 0 && (
                <div className="absolute top-0 right-0 bg-emerald-600 text-white px-2 py-1 m-2 text-xs font-bold rounded">
                  {court.sport_types[0]}
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{court.name}</h3>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{court.address}</span>
              </div>
              {court.amenities && court.amenities.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Tiện ích:</p>
                  <div className="flex flex-wrap gap-1">
                    {court.amenities.map((amenity, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mt-4">
                <div className="text-emerald-600 font-semibold">
                  {court.slots && court.slots.length > 0 
                    ? `${new Intl.NumberFormat('vi-VN').format(court.slots[0].price)}đ/giờ`
                    : 'Liên hệ để biết giá'}
                </div>
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm"
                  onClick={() => alert(`Đặt sân: ${court.name}`)}
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courts;