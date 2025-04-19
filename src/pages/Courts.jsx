import React, { useEffect } from 'react';
import { useCourt } from '../hooks/useCourt';

function Courts() {
  const { courts, loading, error, fetchCourts, addCourt } = useCourt();
  const [name, setName] = React.useState('');
  const [location, setLocation] = React.useState('');

  useEffect(() => {
    fetchCourts();
  }, [fetchCourts]);

  const handleAddCourt = (e) => {
    e.preventDefault();
    addCourt(name, location);
    setName('');
    setLocation('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Danh sách sân vận động</h2>
      {loading && <p className="text-gray-500 text-center">Đang tải...</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="grid gap-4 mb-8">
        {courts.map((court) => (
          <div
            key={court.id}
            className="border border-gray-200 p-4 rounded-lg shadow-sm flex items-center space-x-4"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{court.name}</h3>
              <p className="text-gray-600">{court.location}</p>
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              onClick={() => alert(`Đặt sân: ${court.name}`)}
            >
              Đặt sân
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddCourt} className="space-y-4 bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center">Thêm sân mới</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên sân</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Địa điểm</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          Thêm sân
        </button>
      </form>
    </div>
  );
}

export default Courts;