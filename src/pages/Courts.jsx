import React, { useEffect, useState } from 'react';
import { courtRepo } from '../api/features/CourtRepo';
import toast from 'react-hot-toast';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeType, setActiveType] = useState('all');
  const [location, setLocation] = useState('');
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtDetails, setCourtDetails] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchCourts();
  }, []);

  useEffect(() => {
    if (courts.length > 0) {
      filterCourts();
    }
  }, [courts, activeType, location]);

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
      setFilteredCourts(courtsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching courts:', err);
      setError('Không thể tải danh sách sân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

const filterCourts = () => {
  let filtered = [...courts];
  
  if (activeType !== 'all') {
    filtered = filtered.filter(court => 
      court.sport_types && court.sport_types.includes(activeType)
    );
  }
  
  if (location.trim() !== '') {
    const locationLower = location.toLowerCase().trim();
    filtered = filtered.filter(court => {
      const address = court.location && court.location.full_address 
        ? court.location.full_address.toLowerCase() 
        : '';
      return address.includes(locationLower);
    });
  }
  
  setFilteredCourts(filtered);
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

  const openBookingModal = async (court) => {
    try {
      setSelectedCourt(court);
      setIsBookingModalOpen(true);
      setLoadingDetails(true);
      
      const response = await courtRepo.getCourtById(court._id);
      setCourtDetails(response.metadata);
      setSelectedSlot(null);
    } catch (err) {
      console.error('Error fetching court details:', err);
      toast.error('Không thể tải thông tin chi tiết của sân. Vui lòng thử lại sau.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedCourt(null);
    setCourtDetails(null);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const confirmBooking = () => {
    if (!selectedSlot) {
      toast.error('Vui lòng chọn khung giờ trước khi đặt sân');
      return;
    }
    
    toast.success(`Đã đặt sân ${selectedCourt.name} vào ngày ${new Date(selectedSlot.date).toLocaleDateString('vi-VN')} khung giờ ${selectedSlot.time}`);
    closeBookingModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Filter UI */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại sân</label>
            <select 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
              value={activeType}
              onChange={(e) => setActiveType(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="football">Sân bóng đá</option>
              <option value="basketball">Sân bóng rổ</option>
              <option value="tennis">Sân tennis</option>
              <option value="volleyball">Sân bóng chuyền</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Nhập quận/huyện hoặc phường/xã"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setActiveType('all');
                setLocation('');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </div>

      {/* Kết quả tìm kiếm */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Danh sách sân</h2>
        <p className="text-gray-600">Tìm thấy {filteredCourts.length} sân</p>
      </div>

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

        {!loading && !error && filteredCourts.length === 0 && (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500 text-lg">Không tìm thấy sân nào phù hợp với tiêu chí của bạn.</p>
          </div>
        )}

        {!loading && !error && filteredCourts.map((court) => (
          <div key={court._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
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
                  {/* Nút Previous */}
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
                  
                  {/* Nút Next */}
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
                  
                  {/* Indicator dots */}
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
              
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{court.name}</h3>
              </div>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{court.location && court.location.full_address ? court.location.full_address : 'Chưa có địa chỉ'}</span>
              </div>
              
              {/* Phần hiển thị thông tin sport_types và amenities theo grid */}
              <div className="mt-3 mb-3">
                <div className="grid grid-cols-2 gap-2 h-24">
                  <div className="overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-1 sticky top-0 bg-white">Loại sân:</p>
                    <div className="flex flex-wrap gap-1">
                      {court.sport_types && court.sport_types.map((type, index) => (
                        <span key={index} className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mb-1">
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-1 sticky top-0 bg-white">Tiện ích:</p>
                    <div className="flex flex-wrap gap-1">
                      {court.amenities && court.amenities.map((amenity, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mb-1">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div> 
              
              <div className="mt-auto pt-4">
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors text-sm cursor-pointer"
                  onClick={() => openBookingModal(court)}
                >
                  Đặt ngay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal đặt sân */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeBookingModal}></div>
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedCourt ? `Đặt sân: ${selectedCourt.name}` : 'Đặt sân'}
              </h3>
              <button
                onClick={closeBookingModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingDetails ? (
              <div className="flex justify-center py-10">
                <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg text-gray-600">Đang tải dữ liệu...</span>
              </div>
            ) : courtDetails ? (
              <div>
                <p className="mb-4 text-sm text-gray-600">Vui lòng chọn khung giờ phù hợp:</p>
                
                {courtDetails.slots && courtDetails.slots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courtDetails.slots
                      .filter(slot => slot.status === 'available')
                      .map((slot, index) => (
                        <div 
                          key={index}
                          onClick={() => handleSlotSelect(slot)}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedSlot && selectedSlot._id === slot._id
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{new Date(slot.date).toLocaleDateString('vi-VN')}</p>
                              <p className="text-sm text-gray-600">{slot.time}</p>
                            </div>
                            <p className="text-emerald-600 font-medium">{slot.price.toLocaleString()}₫</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-center py-6 text-gray-500">Hiện không có khung giờ trống nào.</p>
                )}
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeBookingModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={confirmBooking}
                    disabled={!selectedSlot}
                    className={`px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors ${
                      !selectedSlot ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Xác nhận đặt
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center py-6 text-red-500">Có lỗi xảy ra khi tải thông tin sân.</p>
            )}
          </div>
        </div>
      )}
    </div>
    
  );
}

export default Courts;