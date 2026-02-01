import React from "react";
import { X } from "lucide-react";

const FeedbackModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h2 className="text-xl font-bold text-stone-800">Share Feedback</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-200 rounded-full text-stone-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Iframe Content */}
                <div className="flex-1 w-full bg-white relative">
                    <iframe
                        src="https://docs.google.com/forms/d/e/1FAIpQLSfsumMzcBOvPNBvZ3mmVdAJxdkkOSVqUJdoDgApWlcw5QglzQ/viewform?embedded=true"
                        className="absolute inset-0 w-full h-full border-0"
                        title="Feedback Form"
                    >
                        Loading…
                    </iframe>
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
