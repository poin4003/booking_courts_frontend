import React from 'react';

const Pagination = ({ currentPage, onPageChange, hasMore, totalItems, itemsPerPage }) => {
  const hasPrevious = currentPage > 1;
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = currentPage * itemsPerPage;

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Thông tin trang */}
      <div className="text-sm text-gray-700">
        {totalItems > 0 && (
          <>
            Hiển thị <span className="font-medium">{startItem}</span> - 
            <span className="font-medium">{Math.min(endItem, totalItems)}</span>
            {totalItems && <> trên tổng số <span className="font-medium">{totalItems}</span> sân</>}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center space-x-3">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className={`flex items-center px-4 py-2 text-sm font-medium border rounded-md ${
            !hasPrevious
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-emerald-600'
          }`}
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Trước
        </button>

        {/* Current page */}
        <span className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white border border-emerald-600 rounded-md">
          Trang {currentPage}
        </span>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasMore}
          className={`flex items-center px-4 py-2 text-sm font-medium border rounded-md ${
            !hasMore
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-emerald-600'
          }`}
        >
          Sau
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;