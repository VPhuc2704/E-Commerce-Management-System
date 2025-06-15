const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
                <div className="hidden sm:block">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Trang trước</span>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Trang sau</span>
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </nav>
                </div>
                <div className="sm:hidden flex justify-between">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span className="px-4 py-1 text-sm text-gray-700">
                        Trang {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;