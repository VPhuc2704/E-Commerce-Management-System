import React from 'react';

// Product Status Component
export const ProductStatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Con_Hang':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Het_Hang':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Ngung_San_Xuat':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Con_Hang':
                return 'Còn hàng';
            case 'Het_Hang':
                return 'Hết hàng';
            case 'Ngung_San_Xuat':
                return 'Ngừng sản xuất';
            default:
                return status;
        }
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
};

// Product Card Component
export const ProductCard = ({ product, onClick }) => {
    return (
        <div
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onClick?.(product)}
        >
            <div className="aspect-w-1 aspect-h-1">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4">
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 truncate">{product.description}</p>
                <div className="mt-2 flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">
                        {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <ProductStatusBadge status={product.status} />
                </div>
            </div>
        </div>
    );
};