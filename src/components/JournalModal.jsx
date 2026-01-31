import React, { useState } from "react";
import SouvenirDie from "./SouvenirDie";
import { Camera, X } from "lucide-react";

const JournalModal = ({ isOpen, countryName, onClose, onSave }) => {
    const [step, setStep] = useState(1); // 1: Region, 2: Roll, 3: Answer/Photo
    const [region, setRegion] = useState("");
    const [souvenir, setSouvenir] = useState(null);
    const [answer, setAnswer] = useState("");
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    if (!isOpen) return null;

    const handleRollComplete = (result) => {
        setSouvenir(result);
        setTimeout(() => setStep(3), 1500); // Wait a bit to show result
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave({
            country: countryName,
            region,
            souvenir,
            answer,
            photo: photoPreview // Saving base64 for localstorage simplicity (limited size, but ok for prototype)
        });
        // Reset and close
        setStep(1);
        setRegion("");
        setSouvenir(null);
        setAnswer("");
        setPhoto(null);
        setPhotoPreview(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-stone-800 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span>✈️</span> Arriving in <span className="text-yellow-400">{countryName}</span>
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-stone-700 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* content */}
                <div className="p-6 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <p className="text-stone-600">To unlock this country, let's get specific.</p>
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Which City or Region is the student from?
                                </label>
                                <input
                                    type="text"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    placeholder="e.g. Rio de Janeiro"
                                    className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 outline-none"
                                    autoFocus
                                />
                            </div>
                            <button
                                disabled={!region.trim()}
                                onClick={() => setStep(2)}
                                className="w-full bg-stone-800 text-white py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-stone-900 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in-95">
                            <p className="text-stone-600">
                                Ask the student to roll the <span className="font-bold text-stone-800">Souvenir Die</span> to see what they share!
                            </p>
                            <SouvenirDie onRollComplete={handleRollComplete} />
                            {souvenir && (
                                <div className={`mt-4 p-4 rounded-lg ${souvenir.color} animate-bounce`}>
                                    Rolled: <span className="font-bold">{souvenir.title}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && souvenir && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                            {/* Question Card */}
                            <div className={`p-4 rounded-xl border-2 ${souvenir.color.replace('text-', 'border-').replace('bg-', 'bg-opacity-20 ')}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">{souvenir.icon}</span>
                                    <span className="font-bold uppercase tracking-wider text-xs">{souvenir.title}</span>
                                </div>
                                <p className="text-lg font-medium text-stone-800">
                                    "{souvenir.question}"
                                </p>
                            </div>

                            {/* Answer Input */}
                            <div>
                                <label className="block text-sm font-medium text-stone-500 mb-1">Their Answer</label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Type their answer here..."
                                    className="w-full p-3 border border-stone-300 rounded-lg h-24 focus:ring-2 focus:ring-stone-500 outline-none resize-none"
                                />
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-stone-500 mb-1">Process Visa Photo</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex-1 cursor-pointer bg-stone-100 hover:bg-stone-200 border-dashed border-2 border-stone-300 rounded-lg h-32 flex flex-col items-center justify-center text-stone-500 transition-colors">
                                        {photoPreview ? (
                                            <img src={photoPreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                                        ) : (
                                            <>
                                                <Camera size={24} className="mb-2" />
                                                <span className="text-xs">Tap to Take Selfie</span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            <button
                                disabled={!answer.trim()}
                                onClick={handleSave}
                                className="w-full bg-yellow-400 text-stone-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors shadow-lg transform active:scale-95"
                            >
                                STAMP PASSPORT & UNLOCK
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalModal;
