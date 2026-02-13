import React, { useState } from "react";
import { X, PlayCircle, Minimize2, Maximize2, Map } from "lucide-react";

const VideoModal = ({ isOpen, onClose }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isOpen) return null;

    // Handle backdrop click to minimize
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isMinimized) {
            setIsMinimized(true);
        }
    };

    return (
        <div
            className={`fixed transition-all duration-500 ease-in-out z-[300] ${isMinimized
                ? "bottom-6 right-6 w-72 sm:w-96 aspect-video shadow-2xl scale-100"
                : "inset-0 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4"
                }`}
            onClick={handleBackdropClick}
        >
            <div className={`bg-stone-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-stone-800 transition-all duration-500 ${isMinimized
                ? "w-full h-full border-stone-700"
                : "w-full max-w-4xl aspect-video animate-in zoom-in-95"
                }`}>

                {/* Header Overlay (visible on hover) */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex items-center gap-2 text-white">
                        <PlayCircle size={20} className="text-yellow-400" />
                        <span className="font-bold tracking-tight uppercase text-xs sm:text-sm">
                            {isMinimized ? "Explainer" : "Explainer Video"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isMinimized ? (
                            <button onClick={() => setIsMinimized(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" title="Minimize">
                                <Minimize2 size={20} />
                            </button>
                        ) : (
                            <button onClick={() => setIsMinimized(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors" title="Maximize">
                                <Maximize2 size={20} />
                            </button>
                        )}
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Video Iframe - PERSISTENT so it doesn't restart */}
                <div className="flex-1 w-full relative pointer-events-auto">
                    <iframe
                        src="https://drive.google.com/file/d/1EgH6v_Wyaplxamoo-mP6_14hyUU9gLFitnCiySeLWEI/preview"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="autoplay"
                        title="Global Atlas Explainer"
                    />
                </div>

                {/* OBVIOUS ACTION BUTTON (Only in full mode) */}
                {!isMinimized && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsMinimized(true);
                            }}
                            className="pointer-events-auto mt-64 bg-yellow-400 text-stone-900 px-8 py-4 rounded-full font-black text-lg shadow-[0_0_50px_rgba(250,204,21,0.3)] hover:bg-yellow-500 hover:scale-110 active:scale-95 transition-all flex items-center gap-3 animate-bounce"
                        >
                            <Map size={24} />
                            START EXPLORING MAP
                        </button>
                    </div>
                )}

                {/* Floating Tooltip for Backdrop (Only in full mode) */}
                {!isMinimized && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-xs font-bold tracking-widest uppercase pointer-events-none">
                        Click outside to start playing
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoModal;
