import React, { useState, useEffect } from 'react';
import { courtRepo } from '../api/features/CourtRepo';
// import { useAuth } from '../context/auth/AuthContext';
// import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AdminVenues() {
  // const { user } = useAuth();
  // const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: {
      type: 'Point',
      coordinates: [106.6297, 10.8231], 
      city: 'Thành phố Hồ Chí Minh',
      district: '',
      ward: '',
      street: '',
      full_address: ''
    },
    sport_types: [],
    amenities: [],
    images: [],
    slots: [],
    deals: []
  });
  const [newSportType, setNewSportType] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    price: 0,
    status: 'available'
  });

  const [newImage, setNewImage] = useState('');
  const [newDeal, setNewDeal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const goongApiKey = '0cbAqIA7NZimLsVEiazPK4OdQCWStFG1jFeciE1U';

  const searchAddressGoong = async (inputText) => {
    if (!inputText || inputText.length < 3) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchingAddress(true);
      const response = await fetch(
        `https://rsapi.goong.io/Place/AutoComplete?api_key=${goongApiKey}&input=${encodeURIComponent(inputText)}&location=10.7769,106.7009&more_compound=true&radius=30000`
      );

      if (!response.ok) {
        throw new Error('Không thể tìm kiếm địa chỉ');
      }

      const data = await response.json();
      
      if (data && data.predictions) {
        const hcmcResults = data.predictions.filter(prediction => 
          prediction.description.includes('Hồ Chí Minh') || 
          prediction.description.includes('Ho Chi Minh')
        );
        
        setSearchResults(hcmcResults);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error searching address:', error);
      toast.error('Lỗi khi tìm kiếm địa chỉ. Vui lòng thử lại sau.');
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setSearchingAddress(false);
    }
  };

  const handleSelectAddress = async (placeId) => {
    try {
      setSearchingAddress(true);
      setShowSuggestions(false);
      
      const response = await fetch(
        `https://rsapi.goong.io/Place/Detail?api_key=${goongApiKey}&place_id=${placeId}`
      );

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin địa điểm');
      }

      const data = await response.json();
      
      if (data && data.result) {
        const place = data.result;
        
        console.log('Goong API Place Detail result:', place);
        
        const lat = place.geometry.location.lat;
        const lng = place.geometry.location.lng;
        
        let street = '';
        let ward = '';
        let district = '';
        const city = 'Thành phố Hồ Chí Minh';
        
        if (place.name && !place.name.includes('Phường') && !place.name.includes('Quận')) {
          street = place.name;
        } else if (place.address_components && place.address_components.length > 0) {
          street = place.address_components[0].long_name;
        }
        
        if (place.compound) {
          console.log('Compound information:', place.compound);
          
          if (place.compound.district) {
            district = place.compound.district.includes('Quận') 
              ? place.compound.district 
              : `Quận ${place.compound.district}`;
          }
          
          if (place.compound.commune) {
            if (!place.compound.commune.includes('Phường') && !place.compound.commune.includes('Xã')) {
              ward = `Phường ${place.compound.commune}`;
            } else {
              ward = place.compound.commune;
            }
          }
        }
        
        if ((!district || !ward) && place.formatted_address) {
          const addressParts = place.formatted_address.split(',').map(part => part.trim());
          
          for (const part of addressParts) {
            if (!district && (part.includes('Quận') || part.includes('Huyện'))) {
              district = part;
            } else if (!ward && (part.includes('Phường') || part.includes('Xã'))) {
              ward = part;
            } else if (!street && !part.includes('Quận') && !part.includes('Phường') && 
                      !part.includes('Hồ Chí Minh') && !part.includes('Thành phố')) {
              street = part;
            }
          }
        }
        
        console.log('Extracted information:', { street, ward, district, city });
        
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            coordinates: [lng, lat],
            city: city,
            district: district,
            ward: ward,
            street: street,
            full_address: place.formatted_address || place.name
          }
        }));
        
        setSearchAddress(place.formatted_address || place.name);
        
        toast.success('Đã chọn địa chỉ ở TP.HCM');
      } else {
        toast.error('Không thể lấy thông tin địa điểm. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      toast.error('Lỗi khi lấy thông tin địa điểm. Vui lòng thử lại sau.');
    } finally {
      setSearchingAddress(false);
    }
  };

  // useEffect(() => {
  //   if (!user || !user.role || !user.role.includes('ADMIN')) {
  //     navigate('/');
  //     toast.error('Bạn không có quyền truy cập trang này');
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchAddress.trim()) {
        searchAddressGoong(searchAddress);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchAddress]);
  
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      const response = await courtRepo.getCourts();
      setVenues(response.metadata || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching venues:', err);
      setError('Không thể tải danh sách sân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedVenue(null);
    setFormData({
      name: '',
      phone: '',
      location: {
        type: 'Point',
        coordinates: [106.7009, 10.7769], 
        city: 'Thành phố Hồ Chí Minh',
        district: '',
        ward: '',
        street: '',
        full_address: ''
      },
      sport_types: [],
      amenities: [],
      images: [],
      slots: [],
      deals: []
    });
    
    setNewSlot({
      date: '',
      time: '',
      price: 0,
      status: 'available'
    });
    
    setNewImage('');
    setNewDeal('');
    setSearchAddress('');
    setSearchResults([]);
    
    setIsModalOpen(true);
  };
  
  const openEditModal = async (venue) => {
    try {
      setLoading(true);
      
      const response = await courtRepo.getCourtById(venue._id);
      const venueDetail = response.metadata;
      
      setSelectedVenue(venueDetail);
      
      setFormData({
        name: venueDetail.name || '',
        phone: venueDetail.phone || '',
        location: venueDetail.location || {
          type: 'Point',
          coordinates: [106.7009, 10.7769], 
          city: 'Thành phố Hồ Chí Minh', 
          district: '',
          ward: '',
          street: '',
          full_address: ''
        },
        sport_types: venueDetail.sport_types || [],
        amenities: venueDetail.amenities || [],
        images: venueDetail.images || [],
        slots: venueDetail.slots || [],
        deals: venueDetail.deals || []
      });
      
      if (venueDetail.location && venueDetail.location.city !== 'Thành phố Hồ Chí Minh') {
        setFormData(prev => ({
          ...prev,
          location: {
            ...prev.location,
            city: 'Thành phố Hồ Chí Minh'
          }
        }));
      }
      
      if (venueDetail.location && venueDetail.location.full_address) {
        setSearchAddress(venueDetail.location.full_address);
      } else {
        setSearchAddress('');
      }
      
      setNewSlot({
        date: '',
        time: '',
        price: 0,
        status: 'available'
      });
      
      setNewImage('');
      setNewDeal('');
      setSearchResults([]);
      
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching venue details:', err);
      toast.error('Không thể tải thông tin chi tiết của sân. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addSportType = () => {
    if (!newSportType) {
      toast.error('Vui lòng nhập loại sân');
      return;
    }
    
    setFormData({
      ...formData,
      sport_types: [...formData.sport_types, newSportType]
    });
    
    setNewSportType('');
  };
  
  const removeSportType = (index) => {
    const updatedSportTypes = [...formData.sport_types];
    updatedSportTypes.splice(index, 1);
    setFormData({
      ...formData,
      sport_types: updatedSportTypes
    });
  };
  
  const addAmenity = () => {
    if (!newAmenity) {
      toast.error('Vui lòng nhập tiện ích');
      return;
    }
    
    setFormData({
      ...formData,
      amenities: [...formData.amenities, newAmenity]
    });
    
    setNewAmenity('');
  };
  
  const removeAmenity = (index) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities.splice(index, 1);
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const handleNewSlotChange = (e) => {
    const { name, value } = e.target;
    setNewSlot({
      ...newSlot,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    });
  };

  const addSlot = () => {
    if (!newSlot.date || !newSlot.time || newSlot.price <= 0) {
      toast.error('Vui lòng điền đầy đủ thông tin slot');
      return;
    }
    
    // Chỉ giữ lại các trường được backend chấp nhận
    const { date, ...slotWithoutDate } = newSlot;
    
    setFormData({
      ...formData,
      slots: [...formData.slots, slotWithoutDate]
    });
    
    setNewSlot({
      date: '',
      time: '',
      price: 0,
      status: 'available'
    });
  };

  const removeSlot = (index) => {
    const updatedSlots = [...formData.slots];
    updatedSlots.splice(index, 1);
    setFormData({
      ...formData,
      slots: updatedSlots
    });
  };

  const addImage = () => {
    if (!newImage) {
      toast.error('Vui lòng nhập URL hình ảnh');
      return;
    }
    
    setFormData({
      ...formData,
      images: [...formData.images, newImage]
    });
    
    setNewImage('');
  };

  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };

  const addDeal = () => {
    if (!newDeal) {
      toast.error('Vui lòng nhập thông tin khuyến mãi');
      return;
    }
    
    setFormData({
      ...formData,
      deals: [...formData.deals, newDeal]
    });
    
    setNewDeal('');
  };

  const removeDeal = (index) => {
    const updatedDeals = [...formData.deals];
    updatedDeals.splice(index, 1);
    setFormData({
      ...formData,
      deals: updatedDeals
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (!formData.location.district || !formData.location.ward || !formData.location.street) {
        toast.error('Vui lòng điền đầy đủ thông tin địa chỉ (Quận/Huyện, Phường/Xã, Đường)');
        setLoading(false);
        return;
      }
      
      const dataToSend = {...formData};
      
      if (dataToSend.location) {
        dataToSend.location.type = 'Point';
        dataToSend.location.city = 'Thành phố Hồ Chí Minh';
        
        if (!dataToSend.location.full_address || dataToSend.location.full_address.trim() === '') {
          dataToSend.location.full_address = `${dataToSend.location.street}, ${dataToSend.location.ward}, ${dataToSend.location.district}, ${dataToSend.location.city}`;
        }
      }
      
      if (dataToSend.slots && dataToSend.slots.length > 0) {
        dataToSend.slots = dataToSend.slots.map(slot => {
          // Loại bỏ trường date và _id
          const { _id, date, ...slotWithoutDateAndId } = slot;
          
          return {
            ...slotWithoutDateAndId,
            price: parseFloat(slotWithoutDateAndId.price)
          };
        });
      }
      
      console.log('Sending data:', dataToSend);
      
      if (selectedVenue) {
        await courtRepo.updateCourt(selectedVenue._id, dataToSend);
        toast.success('Cập nhật sân thành công!');
      } else {
        await courtRepo.addCourt(dataToSend);
        toast.success('Thêm sân mới thành công!');
      }
      
      setIsModalOpen(false);
      fetchVenues();
    } catch (err) {
      console.error('Error saving venue:', err);
      toast.error(err.response?.message || err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sân này?')) {
      try {
        setLoading(true);
        await courtRepo.deleteCourt(id);
        toast.success('Xóa sân thành công!');
        fetchVenues();
      } catch (err) {
        console.error('Error deleting venue:', err);
        toast.error('Không thể xóa sân. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Quản lý sân thể thao</h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Thêm, chỉnh sửa hoặc xóa các sân thể thao trong hệ thống
        </p>
      </div>
  
      <div className="mt-8 flex justify-end">
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm sân mới
          </div>
        </button>
      </div>
  
      {loading && <p className="text-center mt-8">Đang tải...</p>}
      {error && <p className="text-center text-red-500 mt-8">{error}</p>}
  
      {/* Danh sách venue */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sân</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại sân</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiện ích</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {venues.length > 0 ? (
              venues.map((venue) => (
                <tr key={venue._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{venue.location && venue.location.full_address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {venue.sport_types && venue.sport_types.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {venue.amenities && venue.amenities.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button
                      onClick={() => openEditModal(venue)}
                      className="text-emerald-600 hover:text-emerald-900 mr-4 cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(venue._id)}
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không có sân nào. Hãy thêm sân mới!
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
  
      {/* Modal thêm/sửa venue */}
      {isModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 pb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedVenue ? 'Chỉnh sửa sân' : 'Thêm sân mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sân</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>
  
              {/* Thông tin địa chỉ */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-800">Thông tin vị trí tại TP.HCM</h4>
                
                {/* Tìm kiếm địa chỉ với Goong */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tìm vị trí tại TP.HCM
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (searchResults.length > 0) {
                          setShowSuggestions(true);
                        }
                      }}
                      placeholder="Nhập địa chỉ tại TP.HCM để tìm"
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    
                    {searchingAddress && (
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                    
                    {showSuggestions && searchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                        {searchResults.map((result, index) => (
                          <div 
                            key={index} 
                            className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAddress(result.place_id);
                            }}
                          >
                            <div className="text-sm">{result.description}</div>
                            {result.structured_formatting && (
                              <div className="text-xs text-gray-500 mt-1">{result.structured_formatting.secondary_text}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Gợi ý: Nhập tên đường, quận để tìm kiếm (ví dụ: Nguyễn Huệ, Quận 1)
                  </p>
                </div>

                {/* Địa chỉ đầy đủ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ</label>
                  <input
                    type="text"
                    name="location.full_address"
                    value={formData.location.full_address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Địa chỉ đầy đủ sẽ được tự động tạo nếu để trống"
                  />
                </div>

                {/* Các thành phần địa chỉ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thành phố</label>
                    <input
                      type="text"
                      name="location.city"
                      value="Thành phố Hồ Chí Minh"
                      readOnly
                      className="w-full border border-gray-300 bg-gray-50 p-2 rounded-md"
                    />
                    <input
                      type="hidden"
                      name="location.city"
                      value="Thành phố Hồ Chí Minh"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                    <input
                      type="text"
                      name="location.district"
                      value={formData.location.district}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                    <input
                      type="text"
                      name="location.ward"
                      value={formData.location.ward}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Đường</label>
                    <input
                      type="text"
                      name="location.street"
                      value={formData.location.street}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại sân</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newSportType}
                      onChange={(e) => setNewSportType(e.target.value)}
                      className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nhập loại sân"
                    />
                    <button
                      type="button"
                      onClick={addSportType}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  {formData.sport_types.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Danh sách loại sân:</p>
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {formData.sport_types.map((type, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                            <div className="text-sm">{type}</div>
                            <button
                              type="button"
                              onClick={() => removeSportType(index)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
  
                {/* Phần quản lý tiện ích */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiện ích</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Nhập tiện ích"
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  {formData.amenities.length > 0 && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Danh sách tiện ích:</p>
                      <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {formData.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                            <div className="text-sm">{amenity}</div>
                            <button
                              type="button"
                              onClick={() => removeAmenity(index)}
                              className="text-red-600 hover:text-red-900 cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
  
              {/* Phần quản lý hình ảnh */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="URL hình ảnh"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    Thêm
                  </button>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Danh sách hình ảnh:</p>
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                          <div className="text-sm truncate">{image}</div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
  
              {/* Phần quản lý slot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slots (lịch trình)</label>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  <input
                    type="date"
                    name="date"
                    value={newSlot.date}
                    onChange={handleNewSlotChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ngày"
                  />
                  <select
                    name="time"
                    value={newSlot.time}
                    onChange={handleNewSlotChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Chọn khung giờ</option>
                    <option value="7:00-9:00">7:00-9:00</option>
                    <option value="9:00-11:00">9:00-11:00</option>
                    <option value="11:00-13:00">11:00-13:00</option>
                    <option value="13:00-15:00">13:00-15:00</option>
                    <option value="15:00-17:00">15:00-17:00</option>
                    <option value="17:00-19:00">17:00-19:00</option>
                    <option value="19:00-21:00">19:00-21:00</option>
                  </select>
                  <input
                    type="number"
                    name="price"
                    value={newSlot.price}
                    onChange={handleNewSlotChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Giá"
                    min="0"
                    step="0.01"
                  />
                  <div className="flex items-center space-x-2">
                    <select
                      name="status"
                      value={newSlot.status}
                      onChange={handleNewSlotChange}
                      className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="available">Trống</option>
                      <option value="pending">Đang chờ</option>
                      <option value="booked">Đã đặt</option>
                    </select>
                    <button
                      type="button"
                      onClick={addSlot}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
  
                {formData.slots.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Danh sách slots:</p>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md mt-1">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Ngày</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Giờ</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Giá</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Trạng thái</th>
                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {formData.slots.map((slot, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {new Date(slot.date).toLocaleDateString()}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{slot.time}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{slot.price}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  slot.status === 'available' ? 'bg-green-100 text-green-800' :
                                  slot.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {slot.status === 'available' ? 'Trống' : 
                                   slot.status === 'pending' ? 'Đang chờ' : 'Đã đặt'}
                                </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() => removeSlot(index)}
                                  className="text-red-600 hover:text-red-900 cursor-pointer"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
  
              {/* Phần quản lý khuyến mãi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khuyến mãi</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newDeal}
                    onChange={(e) => setNewDeal(e.target.value)}
                    className="flex-1 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Thông tin khuyến mãi"
                  />
                  <button
                    type="button"
                    onClick={addDeal}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    Thêm
                  </button>
                </div>
                
                {formData.deals.length > 0 && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Danh sách khuyến mãi:</p>
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {formData.deals.map((deal, index) => (
                        <div key={index} className="flex items-center justify-between py-1 border-b border-gray-200">
                          <div className="text-sm">{deal}</div>
                          <button
                            type="button"
                            onClick={() => removeDeal(index)}
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
  
              <div className="flex justify-end pt-4 space-x-3 sticky bottom-0 bg-white z-10 border-t border-gray-200 mt-6 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-400 cursor-pointer" 
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminVenues;