import React from "react";
import { X } from "lucide-react";

const PassportGallery = ({ isOpen, onClose, entries, countryStats }) => {
    if (!isOpen) return null;

    const getMasteryInfo = (regionCount) => {
        if (regionCount >= 3) return { label: "GOLD MASTER", class: "bg-yellow-400 text-stone-900" };
        if (regionCount === 2) return { label: "SILVER", class: "bg-zinc-300 text-zinc-900 border border-zinc-400" };
        return { label: "BRONZE", class: "bg-orange-700 text-white" };
    };

    return (
        <div className="fixed inset-0 bg-stone-900/90 z-50 flex flex-col animate-in fade-in duration-300">
            <div className="p-4 flex justify-between items-center text-white border-b border-stone-700">
                <h2 className="text-2xl font-bold tracking-wider uppercase">My Passport</h2>
                <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-full">
                    <X size={24} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4 auto-rows-max">
                {entries.length === 0 ? (
                    <div className="col-span-2 text-center py-20 text-stone-500">
                        <p className="text-xl mb-2">Empty Pages</p>
                        <p className="text-sm">Go meet the world!</p>
                    </div>
                ) : (
                    entries.map((entry, index) => {
                        const stats = countryStats[entry.country];
                        const regionCount = stats ? stats.regions.size : 0;
                        const mastery = getMasteryInfo(regionCount);

                        return (
                            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-200">
                                <div className="h-32 bg-stone-200 relative">
                                    {entry.photo ? (
                                        <img src={entry.photo} alt={entry.country} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl">
                                            ✈️
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
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default PassportGallery;
