import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Heart, Eye, Hotel } from 'lucide-react';
import { useDestination } from '../context/DestinationContext';

const categoryColors = {
  Historical: 'bg-purple-100 text-purple-700',
  'Hill Station': 'bg-sky-100 text-sky-700',
  Beach: 'bg-teal-100 text-teal-700',
  Adventure: 'bg-amber-100 text-amber-700',
  Nature: 'bg-emerald-100 text-emerald-700',
  Temple: 'bg-orange-100 text-orange-700',
  Heritage: 'bg-indigo-100 text-indigo-700',
};

const TouristPlaceCard = ({ place, onSelectPlace }) => {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorited, selectPlace } = useDestination();
  const favorited = isFavorited(place.placeId);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(place.placeId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/places/${place.placeId}`);
  };

  const handleHotelsClick = (e) => {
    e.stopPropagation();
    if (onSelectPlace) {
      onSelectPlace(place);
    } else {
      selectPlace(place);
      navigate(`/hotels?placeId=${place.placeId}`);
    }
  };

  const badgeClass = categoryColors[place.category] || 'bg-slate-100 text-slate-700';

  return (
    <div className="bg-white rounded-2xl border border-slate-300 hover:border-emerald-500 shadow-soft card-hover overflow-hidden flex flex-col justify-between">
      {/* Top Banner Image if available */}
      {place.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={place.imageUrl}
            alt={place.placeName}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={handleFavoriteClick}
            aria-label="Favorite toggle"
            className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all ${
              favorited
                ? 'bg-white text-rose-500 shadow-md'
                : 'bg-black/40 text-white hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500' : ''}`} />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
              {place.category}
            </span>
            {!place.imageUrl && (
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-colors ${
                  favorited ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorited ? 'fill-rose-500' : ''}`} />
              </button>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 hover:text-emerald-700 transition-colors">
            {place.placeName}
          </h3>

          <p className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-1 mb-3">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{place.city}, {place.state}</span>
          </p>

          <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed mb-3.5">
            {place.description}
          </p>

          {place.visitingHours && (
            <p className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="truncate">Hours: {place.visitingHours}</span>
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2.5 mt-5 pt-3.5 border-t border-slate-100">
          <button
            onClick={handleDetailsClick}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" /> View Details
          </button>
          <button
            onClick={handleHotelsClick}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Hotel className="w-4 h-4" /> Find Hotels
          </button>
        </div>
      </div>
    </div>
  );
};

export default TouristPlaceCard;
