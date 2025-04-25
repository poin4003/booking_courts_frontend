import React, { useState, useEffect } from 'react';
import { courtRepo } from '../api/features/CourtRepo';
import { useAuth } from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, formData, setFormData }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFormData({
        ...formData,
        location: { lat, lng }
      });
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position ? 
    <Marker position={position} /> 
    : null;
}

function AdminVenues() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    location: { lat: 0, lng: 0 },
    sport_types: [],
    amenities: [],
    images: [],
    slots: [],
    deals: []
  });

  const [newSlot, setNewSlot] = useState({
    date: '',
    time: '',
    price: 0,
    status: 'available'
  });

  const [newImage, setNewImage] = useState('');
  
  const [newDeal, setNewDeal] = useState('');

  useEffect(() => {
    if (!user || !user.role || !user.role.includes('ADMIN')) {
      navigate('/');
      toast.error('Bạn không có quyền truy cập trang này');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchVenues();
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
      address: '',
      phone: '',
      location: { lat: 10.8231, lng: 106.6297 },
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
    setMarkerPosition([10.8231, 106.6297]);
    setIsModalOpen(true);
  };

  const openEditModal = (venue) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      phone: venue.phone || '',
      location: venue.location,
      sport_types: venue.sport_types || [],
      amenities: venue.amenities || [],
      images: venue.images || [],
      slots: venue.slots || [],
      deals: venue.deals || []
    });
    
    setNewSlot({
      date: '',
      time: '',
      price: 0,
      status: 'available'
    });
    setNewImage('');
    setNewDeal('');
    
    if (venue.location && venue.location.lat && venue.location.lng) {
      setMarkerPosition([venue.location.lat, venue.location.lng]);
    }
    
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSportTypesChange = (e) => {
    const value = e.target.value;
    const sportTypes = value
      .split(/[,\s]+/) 
      .map(type => type.trim()) 
      .filter(type => type !== ''); 
    
    setFormData({
      ...formData,
      sport_types: sportTypes,
    });
  };
  
  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    const amenities = value
      .split(/[,\s]+/)
      .map(item => item.trim())
      .filter(item => item !== '');
    
    setFormData({
      ...formData,
      amenities: amenities,
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
    
    setFormData({
      ...formData,
      slots: [...formData.slots, {...newSlot}]
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
      
      const dataToSend = {...formData};
      
      if (dataToSend.slots && dataToSend.slots.length > 0) {
        dataToSend.slots = dataToSend.slots.map(slot => {
          const { _id, ...slotWithoutId } = slot;
          return slotWithoutId;
        });
      }
      
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
      toast.error(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
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
                    <div className="text-sm text-gray-500">{venue.address}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{venue.phone}</div>
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
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí (click vào bản đồ để chọn)</label>
                <div className="h-64 w-full border border-gray-300 rounded-md overflow-hidden">
                  <MapContainer 
                    center={markerPosition || [10.8231, 106.6297]} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }} 
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker 
                      position={markerPosition} 
                      setPosition={setMarkerPosition} 
                      formData={formData}
                      setFormData={setFormData}
                    />
                  </MapContainer>
                </div>
                {markerPosition && (
                  <div className="mt-2 text-sm text-gray-600">
                    Tọa độ đã chọn: {formData.location.lat.toFixed(6)}, {formData.location.lng.toFixed(6)}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại sân</label>
                  <input
                    type="text"
                    value={formData.sport_types.join(', ')}
                    onChange={handleSportTypesChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="football, basketball, tennis"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nhập các loại sân, phân cách bằng dấu phẩy hoặc khoảng trắng
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiện ích</label>
                  <input
                    type="text"
                    value={formData.amenities.join(', ')}
                    onChange={handleAmenitiesChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="parking, shower, locker"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Nhập các tiện ích, phân cách bằng dấu phẩy hoặc khoảng trắng
                  </p>
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
                  <input
                    type="text"
                    name="time"
                    value={newSlot.time}
                    onChange={handleNewSlotChange}
                    className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Giờ (vd: 10:00-12:00)"
                  />
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
                                  className="text-red-600 hover:text-red-900"
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
                            className="text-red-600 hover:text-red-900"
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