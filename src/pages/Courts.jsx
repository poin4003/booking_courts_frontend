import React, { useEffect, useState } from 'react';
import { courtRepo } from '../api/features/CourtRepo';
import toast from 'react-hot-toast';
import { bookingRepo } from '../api/features/BookingRepo';

function Courts({ filteredCourts = [], loading = false, error = null, fetchCourts }) {
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courtDetails, setCourtDetails] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [bookingNote, setBookingNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  useEffect(() => {
    const initialImageIndex = {};
    filteredCourts.forEach((court) => {
      initialImageIndex[court._id] = 0;
    });
    setCurrentImageIndex(initialImageIndex);
  }, [filteredCourts]);

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

  const confirmBooking = async () => {
    if (!selectedSlot) {
      toast.error('Vui lòng chọn khung giờ trước khi đặt sân');
      return;
    }

    try {
      setLoadingDetails(true);

      const bookingData = {
        venueId: selectedCourt._id,
        slotId: selectedSlot._id,
        paymentMethod,
        note: bookingNote || ''
      };

      if (paymentMethod === 'cash') {
        await bookingRepo.bookSlot(bookingData);
        toast.success(`Đã đặt sân ${selectedCourt.name} thành công!`);
        setBookingNote('');
        closeBookingModal();
      } else if (paymentMethod === 'vnpay') {
        const vnpayPayload = {
          ...bookingData,
          amount: selectedSlot.price,
          orderDescription: `Đặt sân ${selectedCourt.name} vào ${selectedSlot.time}`,
          orderType: 'billpayment',
          language: 'vn',
          bankCode: ''
        };

        const response = await bookingRepo.createVnpayPayment(vnpayPayload);
        console.log('VNPay response:', response); 

        if (response && response.paymentUrl) {
          window.location.href = response.paymentUrl;
        } else if (response && response.metadata && response.metadata.paymentUrl) {
          window.location.href = response.metadata.paymentUrl;
        } else if (response && response.data && response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          console.error('Invalid response structure:', response);
          throw new Error('Không thể khởi tạo thanh toán VNPay');
        }
      }
    } catch (err) {
      console.error('Error booking slot:', err);
      toast.error(err.message || 'Không thể đặt sân. Vui lòng thử lại sau.');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

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
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full 
                    p-1 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full 
                    p-1 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
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
                    {courtDetails.slots.map((slot, index) => (
                      <div 
                        key={index}
                        onClick={() => slot.status === 'available' && handleSlotSelect(slot)} 
                        className={`p-3 border rounded-lg transition-colors ${
                          slot.status === 'available'
                            ? selectedSlot && selectedSlot._id === slot._id
                              ? 'border-emerald-500 bg-emerald-50 cursor-pointer'
                              : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer'
                            : 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed' 
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">
                              {slot.time} {slot.status === 'booked' && '(Đã đặt)'}
                            </p>
                          </div>
                          <p className={`font-medium ${slot.status === 'available' ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {slot.price.toLocaleString()}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-gray-500">Hiện không có khung giờ trống nào.</p>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Thêm ghi chú cho đơn đặt sân"
                    rows="2"
                  ></textarea>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="cash">Tiền mặt</option>
                      <option value="vnpay">VNPay</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={closeBookingModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={confirmBooking}
                    disabled={!selectedSlot}
                    className={`px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer ${
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