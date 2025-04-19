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
      <h2 className="text-xl font-semibold mb-4">Danh sách sân</h2>
      {loading && <p className="text-gray-500">Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mb-6 space-y-2">
        {courts.map((court) => (
          <li
            key={court.id}
            className="border border-gray-200 p-3 rounded-md shadow-sm"
          >
            {court.name} - {court.location}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddCourt} className="space-y-4">
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
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Thêm sân
        </button>
      </form>
    </div>
  );
}

export default Courts;