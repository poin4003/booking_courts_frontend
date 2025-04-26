import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/auth/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Courts from './pages/Courts';
import LoginModal from './pages/Login';
import SignupModal from './pages/Signup';
import AdminVenues from './pages/AdminVenues';

const AdminRoute = ({ children }) => {
  // const { user } = useAuth();
  
  // if (!user || !user.role || !user.role.includes('ADMIN')) {
  //   return <Navigate to="/" replace />;
  // }
  
  return children;
};

function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setSignupModalOpen] = useState(false);

  const AuthButton = () => {
    const { user, logout } = useAuth();
    return user ? (
      <div className="flex items-center space-x-4">
        <span className="text-emerald-100">Xin chào, {user.name}</span>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition cursor-pointer"
        >
          Đăng xuất
        </button>
      </div>
    ) : (
      <div className="space-x-4">
        <button
          onClick={() => setLoginModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition cursor-pointer"
        >
          Đăng nhập
        </button>
        <button
          onClick={() => setSignupModalOpen(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition cursor-pointer"
        >
          Đăng ký
        </button>
      </div>
    );
  };

  const AdminLink = () => {
    // const { user } = useAuth();
    // if (user && user.role && user.role.includes('ADMIN')) {
      return (
        <Link 
          to="/admin/venues" 
          className="hover:underline hover:text-emerald-100 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Quản lý
        </Link>
      );
    // }
    // return null;
  };

  useEffect(() => {
    const handleOpenSignup = () => setSignupModalOpen(true);
    const handleOpenLogin = () => setLoginModalOpen(true);
    const handleAuthError = () => setLoginModalOpen(true);
    
    document.addEventListener('openSignupModal', handleOpenSignup);
    document.addEventListener('openLoginModal', handleOpenLogin);
    document.addEventListener('authError', handleAuthError);
    
    return () => {
      document.removeEventListener('openSignupModal', handleOpenSignup);
      document.removeEventListener('openLoginModal', handleOpenLogin);
      document.removeEventListener('authError', handleAuthError);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50">
        <header className="bg-emerald-700 text-white shadow-md">
          <nav className="container mx-auto flex justify-between items-center py-4 px-6">
            <div className="flex items-center">
              <Link to="/">
                <h1 className="text-2xl font-bold tracking-wide cursor-pointer mr-8">Booking Courts</h1>
              </Link>
              <div className="flex items-center space-x-6 text-sm font-medium">
                <AdminLink />
              </div>
            </div>
            <div>
              <AuthButton />
            </div>
          </nav>
        </header>
          <main className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courts" element={<Courts />} />
              <Route 
                path="/admin/venues" 
                element={
                  <AdminRoute>
                    <AdminVenues />
                  </AdminRoute>
                } 
              />
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