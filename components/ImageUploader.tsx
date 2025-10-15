
import React, { useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
    id: string;
    label: string;
    onImageUpload: (file: File) => void;
    preview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageUpload, preview }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-purple-500');
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageUpload(file);
        }
    }, [onImageUpload]);

    const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('border-purple-500');
    };
    
    const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-purple-500');
    };


    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="relative flex flex-col items-center justify-center w-full h-64 aspect-square border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800/60 transition-all duration-300"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                        <UploadIcon />
                        <p className="mb-2 text-sm font-semibold">{label}</p>
                        <p className="text-xs">Kéo và thả hoặc nhấp để tải lên</p>
                    </div>
                )}
                <input id={id} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
        </div>
    );
};
