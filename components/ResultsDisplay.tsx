
import React from 'react';
import { SpinnerIcon } from './Icons';

interface ResultsDisplayProps {
    isLoading: boolean;
    error: string | null;
    images: string[];
}

const LoadingState: React.FC = () => (
    <div className="text-center py-10">
        <div className="inline-block">
           <SpinnerIcon />
        </div>
        <h3 className="text-xl font-semibold mt-4 text-gray-200">Đang tạo ảnh...</h3>
        <p className="text-gray-400 mt-2">Quá trình này có thể mất một vài phút. Vui lòng giữ trang mở.</p>
    </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-10 bg-red-900/20 border border-red-500 rounded-lg">
        <h3 className="text-xl font-semibold text-red-400">Lỗi</h3>
        <p className="text-red-300 mt-2">{message}</p>
    </div>
);

const ImageGrid: React.FC<{ images: string[] }> = ({ images }) => (
    <div>
        <h2 className="text-3xl font-bold text-center mb-8">Kết quả của bạn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((base64Image, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <img
                        src={`data:image/png;base64,${base64Image}`}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-full object-cover aspect-square"
                    />
                </div>
            ))}
        </div>
    </div>
);

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, error, images }) => {
    if (isLoading) {
        return <div className="mt-12"><LoadingState /></div>;
    }

    if (error) {
        return <div className="mt-12"><ErrorState message={error} /></div>;
    }

    if (images.length > 0) {
        return <div className="mt-12"><ImageGrid images={images} /></div>;
    }

    return null;
};
