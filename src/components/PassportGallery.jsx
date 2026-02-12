import React from "react";
import { X } from "lucide-react";

const PassportGallery = ({ isOpen, onClose, entries, countryStats }) => {
    if (!isOpen) return null;

    const dummyEntries = [
        {
            country: "Japan",
            region: "Tokyo",
            answer: "Sukiyaki (Ue o Muite Arukō) is a song everyone knows! It's a classic that brings people together.",
            souvenir: { title: "The Anthem", color: "text-blue-600 bg-blue-50" },
            isExample: true
        },
        {
            country: "Brazil",
            region: "Rio de Janeiro",
            answer: "You have to try Feijoada! It's a black bean stew with pork that we usually eat on Saturdays.",
            souvenir: { title: "The Feast", color: "text-orange-600 bg-orange-50" },
            isExample: true
        }
    ];

    const displayEntries = entries.length > 0 ? entries : dummyEntries;

    const getMasteryInfo = (regionCount, isExample) => {
        if (isExample) return { label: "EXAMPLE", class: "bg-stone-200 text-stone-500 border border-stone-300" };
        if (regionCount >= 3) return { label: "GOLD MASTER", class: "bg-yellow-400 text-stone-900" };
        if (regionCount === 2) return { label: "SILVER", class: "bg-zinc-300 text-zinc-900 border border-zinc-400" };
        return { label: "BRONZE", class: "bg-orange-700 text-white" };
    };

    return (
        <div className="fixed inset-0 bg-stone-900/90 z-[200] flex flex-col animate-in fade-in duration-300">
            <div className="p-4 flex justify-between items-center text-white border-b border-stone-700">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold tracking-wider uppercase">My Passport</h2>
                    {entries.length === 0 && <span className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase">Preview Mode</span>}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 auto-rows-max">
                {displayEntries.map((entry, index) => {
                    const stats = !entry.isExample ? countryStats[entry.country] : null;
                    const regionCount = stats ? stats.regions.size : 1;
                    const mastery = getMasteryInfo(regionCount, entry.isExample);

                    return (
                        <div key={index} className={`bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-200 ${entry.isExample ? 'opacity-80 grayscale-[0.3]' : ''}`}>
                            <div className="h-32 bg-stone-200 relative">
                                {entry.photo ? (
                                    <img src={entry.photo} alt={entry.country} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl bg-stone-100">
                                        {entry.country === "Japan" ? "🗾" : entry.country === "Brazil" ? "🦜" : "✈️"}
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${mastery.class}`}>
                                        {mastery.label}
                                    </div>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="font-bold text-lg text-stone-800 leading-tight">{entry.country}</div>
                                <div className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-2">
                                    {entry.region} {regionCount > 1 ? `(+${regionCount - 1} more)` : ""}
                                </div>

                                <div className={`text-xs p-2 rounded bg-opacity-20 ${entry.souvenir?.color?.replace('text-', 'bg-') || 'bg-stone-100'}`}>
                                    <span className="font-bold">{entry.souvenir?.title}:</span> "{entry.answer}"
                                </div>
                                {entry.isExample && (
                                    <div className="mt-2 text-[10px] text-stone-400 italic font-medium">Record a real visit to replace this</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PassportGallery;
