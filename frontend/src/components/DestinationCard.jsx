import React from 'react';
import { MapPin, ArrowRight, Heart } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';

const categoryColors = {
  Historical: 'bg-purple-100 text-purple-700 border-purple-200',
  'Hill Station': 'bg-sky-100 text-sky-700 border-sky-200',
  Beach: 'bg-teal-100 text-teal-700 border-teal-200',
  Adventure: 'bg-amber-100 text-amber-700 border-amber-200',
  Nature: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Temple: 'bg-orange-100 text-orange-700 border-orange-200',
  Heritage: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

const DestinationCard = ({ place, onSelect, isSelected = false }) => {
  const { toggleFavorite, isFavorited } = useDestination();
  const favorited = isFavorited(place.placeId);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(place.placeId);
    } catch (err) {
      console.error(err);
    }
  };

  const badgeClass =
    categoryColors[place.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      onClick={() => onSelect && onSelect(place)}
      className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer card-hover flex flex-col justify-between ${
        isSelected
          ? 'border-emerald-700 ring-2 ring-emerald-700/30 shadow-md'
          : 'border-slate-300 hover:border-emerald-600 shadow-sm'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={place.imageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80'}
          alt={place.placeName}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Badge (Top Left) */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-xs ${badgeClass}`}
        >
          {place.category}
        </span>

        {/* Heart Favorite Button (Top Right) */}
        <button
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            favorited
              ? 'bg-white text-rose-500 scale-105 shadow-md'
              : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
            {place.placeName}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="truncate">{place.city}, {place.state}</span>
          </p>
        </div>

        {/* Circular Arrow Action Button */}
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
            isSelected
              ? 'bg-emerald-700 text-white'
              : 'border border-slate-300 text-slate-600 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700'
          }`}
        >
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
