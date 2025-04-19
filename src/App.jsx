import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth/AuthContext.jsx';
import Home from './pages/Home';
import Courts from './pages/Courts';
import LoginModal from './pages/Login';
import SignupModal from './pages/Signup';

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const AuthButton = () => {
    const { user, logout } = useAuth();
    return user ? (
      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
      >
        Đăng xuất
      </button>
    ) : (
      <div className="space-x-4">
        <button
          onClick={() => setLoginModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Đăng nhập
        </button>
        <button
          onClick={() => setSignupModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Đăng ký
        </button>
      </div>
    );
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-blue-600 text-white p-4">
            <nav className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Booking Courts</h1>
              <div className="space-x-4">
                <Link to="/" className="hover:underline">Home</Link>
                <Link to="/courts" className="hover:underline">Courts</Link>
                <AuthButton />
              </div>
            </nav>
          </header>
          <main className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courts" element={<Courts />} />
            </Routes>
          </main>

          {/* Modal Đăng nhập */}
          {isLoginModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
                <button
                  onClick={() => setLoginModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <LoginModal onClose={() => setLoginModalOpen(false)} />
              </div>
            </div>
          )}

          {/* Modal Đăng ký */}
          {isSignupModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
                <button
                  onClick={() => setSignupModalOpen(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
                <SignupModal onClose={() => setSignupModalOpen(false)} />
              </div>
            </div>
          )}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;