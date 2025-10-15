
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { SpinnerIcon } from './components/Icons';
import { generateStyledImages } from './services/geminiService';

const App: React.FC = () => {
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [productFile, setProductFile] = useState<File | null>(null);
    const [modelPreview, setModelPreview] = useState<string | null>(null);
    const [productPreview, setProductPreview] = useState<string | null>(null);

    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback((file: File, type: 'model' | 'product') => {
        const previewUrl = URL.createObjectURL(file);
        if (type === 'model') {
            setModelFile(file);
            setModelPreview(previewUrl);
        } else {
            setProductFile(file);
            setProductPreview(previewUrl);
        }
    }, []);

    const handleGenerate = async () => {
        if (!modelFile || !productFile) {
            setError('Vui lòng tải lên cả ảnh người mẫu và sản phẩm.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const results = await generateStyledImages(modelFile, productFile);
            setGeneratedImages(results);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto bg-gray-800/50 rounded-2xl shadow-2xl p-6 md:p-10 backdrop-blur-sm border border-gray-700">
                    <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
                        Tải lên ảnh người mẫu và sản phẩm của bạn. AI sẽ tạo ra 6 ảnh quảng cáo độc đáo, giữ lại khuôn mặt người mẫu và làm nổi bật sản phẩm của bạn với chất lượng 4K.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <ImageUploader
                            id="model-uploader"
                            label="Tải lên ảnh người mẫu"
                            onImageUpload={(file) => handleImageUpload(file, 'model')}
                            preview={modelPreview}
                        />
                        <ImageUploader
                            id="product-uploader"
                            label="Tải lên ảnh sản phẩm"
                            onImageUpload={(file) => handleImageUpload(file, 'product')}
                            preview={productPreview}
                        />
                    </div>

                    <div className="text-center">
                        <button
                            onClick={handleGenerate}
                            disabled={!modelFile || !productFile || isLoading}
                            className="relative inline-flex items-center justify-center px-10 py-4 bg-purple-600 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 group shadow-lg shadow-purple-500/30"
                        >
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-purple-600">
                                    <SpinnerIcon />
                                </div>
                            )}
                            <span className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                                Tạo ảnh
                            </span>
                        </button>
                    </div>
                </div>

                <ResultsDisplay
                    isLoading={isLoading}
                    error={error}
                    images={generatedImages}
                />
            </main>
        </div>
    );
};

export default App;
