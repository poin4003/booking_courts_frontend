import React, { useEffect, useState } from 'react';
import { courtRepo } from '../api/features/CourtRepo';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType] = useState('all');
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const response = await courtRepo.getCourts();
      const courtsData = response.metadata || [];
      
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

  const nextImage = (courtId, imagesLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [courtId]: (prev[courtId] + 1) % imagesLength
    }));
  };

  const prevImage = (courtId, imagesLength) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [courtId]: (prev[courtId] - 1 + imagesLength) % imagesLength
    }));
  };

  const goToImage = (courtId, index) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [courtId]: index
    }));
  };

  const displayCourts = activeType === 'all' 
    ? courts 
    : courts.filter(court => court.sport_types && court.sport_types.includes(activeType));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

      {/* Courts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <img
                    src=""
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