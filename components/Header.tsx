
import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
    return (
        <header className="py-6">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 flex items-center justify-center gap-3">
                    <SparklesIcon />
                    <span>AI Advertising Image Generator</span>
                </h1>
                <p className="text-lg text-purple-300">
                    Tạo ảnh quảng cáo chuyên nghiệp trong vài giây
                </p>
            </div>
        </header>
    );
};
