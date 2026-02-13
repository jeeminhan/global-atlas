import React, { useState } from "react";
import { X, PlayCircle, Minimize2, Maximize2 } from "lucide-react";

const VideoModal = ({ isOpen, onClose }) => {
    const [isMinimized, setIsMinimized] = useState(false);

    if (!isOpen) return null;

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-[300] w-72 sm:w-96 aspect-video bg-stone-900 rounded-xl shadow-2xl border border-stone-700 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity z-10">
                    <button onClick={() => setIsMinimized(false)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                        <Maximize2 size={16} />
                    </button>
                    <button onClick={onClose} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                        <X size={16} />
                    </button>
                </div>
                <iframe
                    src="https://drive.google.com/file/d/1EgH6v_Wyaplxamoo-mP6_14hyUU9gLFitnCiySeLWEI/preview"
                    className="w-full h-full border-0"
                    allow="autoplay"
                    title="Global Atlas Explainer"
                />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-stone-950/90 z-[300] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-stone-900 w-full max-w-4xl aspect-video rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-stone-800 animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="flex items-center gap-2 text-white">
                        <PlayCircle size={20} className="text-yellow-400" />
                        <span className="font-bold tracking-tight uppercase text-sm">Explainer Video</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsMinimized(true)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                            <Minimize2 size={20} />
                        </button>
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 w-full relative">
                    <iframe
                        src="https://drive.google.com/file/d/1EgH6v_Wyaplxamoo-mP6_14hyUU9gLFitnCiySeLWEI/preview"
                        className="absolute inset-0 w-full h-full border-0"
                        allow="autoplay"
                        title="Global Atlas Explainer"
                    >
                        Loading...
                    </iframe>
                </div>

                <button
                    onClick={() => setIsMinimized(true)}
                    className="absolute -top-12 right-0 text-white/80 hover:text-white flex items-center gap-2 transition-colors group"
                >
                    <span className="text-xs font-bold uppercase tracking-widest">Start Exploring</span>
                    <Minimize2 size={24} />
                </button>
            </div>
        </div>
    );
};

export default VideoModal;
