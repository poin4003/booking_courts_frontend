import React, { useState, useEffect } from 'react';
import { courtRepo } from '../api/features/CourtRepo';
import { useAuth } from '../context/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AdminVenues() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    location: { lat: 0, lng: 0 },
    sport_types: [],
    amenities: [],
    slots: [],
  });

  // Kiểm tra quyền ADMIN
  useEffect(() => {
    if (!user || !user.role || !user.role.includes('ADMIN')) {
      navigate('/');
      toast.error('Bạn không có quyền truy cập trang này');
    }
  }, [user, navigate]);

  // Lấy danh sách venue
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
      location: { lat: 0, lng: 0 },
      sport_types: [],
      amenities: [],
      slots: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (venue) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      location: venue.location,
      sport_types: venue.sport_types || [],
      amenities: venue.amenities || [],
      slots: venue.slots || [],
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: parseFloat(value) || 0,
      },
    });
  };

  const handleSportTypesChange = (e) => {
    const value = e.target.value;
    const sportTypes = value.split(',').map(type => type.trim());
    setFormData({
      ...formData,
      sport_types: sportTypes,
    });
  };

  const handleAmenitiesChange = (e) => {
    const value = e.target.value;
    const amenities = value.split(',').map(item => item.trim());
    setFormData({
      ...formData,
      amenities: amenities,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (selectedVenue) {
        // Cập nhật venue
        await courtRepo.updateCourt(selectedVenue._id, formData);
        toast.success('Cập nhật sân thành công!');
      } else {
        // Thêm venue mới
        await courtRepo.addCourt(formData);
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
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
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
                    <div className="text-sm text-gray-500">{venue.address}</div>
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
                      className="text-emerald-600 hover:text-emerald-900 mr-4"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(venue._id)}
                      className="text-red-600 hover:text-red-900"
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
          <div className="relative bg-white rounded-lg max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Latitude)</label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    value={formData.location.lat}
                    onChange={handleLocationChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Longitude)</label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    value={formData.location.lng}
                    onChange={handleLocationChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại sân (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.sport_types.join(', ')}
                  onChange={handleSportTypesChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Bóng đá, Bóng rổ, Tennis,..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiện ích (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  value={formData.amenities.join(', ')}
                  onChange={handleAmenitiesChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Phòng thay đồ, Nhà vệ sinh, Chỗ để xe,..."
                />
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:bg-emerald-400"
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