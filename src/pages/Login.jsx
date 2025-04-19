import React, { useState } from 'react';
import { useAuth } from '../context/auth/AuthContext.jsx';
import { Link } from 'react-router-dom';

function LoginModal({ onClose }) {
  const [email, setEmail] = useState('pchuy4003@gmail.com');
  const [password, setPassword] = useState('12345678');
  const { login, loading, error, user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (user) onClose();
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Chưa có tài khoản?{' '}
        <Link
          to="#"
          onClick={(e) => {
            e.preventDefault();
            onClose();
            document.querySelector('button[onClick="setSignupModalOpen(true)"]').click();
          }}
          className="text-blue-600 hover:underline"
        >
          Đăng ký
        </Link>
      </p>
    </div>
  );
}

export default LoginModal;