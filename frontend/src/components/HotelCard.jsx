import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Phone, IndianRupee, Eye } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    navigate(`/hotels/${hotel.hotelId}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 hover:border-emerald-500 shadow-soft card-hover overflow-hidden flex flex-col justify-between">
      {/* Top Banner Image if available */}
      {hotel.imageUrl && (
        <div 
          onClick={handleDetailsClick}
          className="relative h-48 w-full overflow-hidden bg-slate-100 cursor-pointer"
        >
          <img
            src={hotel.imageUrl}
            alt={hotel.hotelName}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-amber-200 text-amber-800 font-bold text-sm shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
            <span>{Number(hotel.rating).toFixed(1)}</span>
          </div>
        </div>
      )}

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Top: Hotel Name + Rating (shown here if no image) */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <h3 
              onClick={handleDetailsClick}
              className="text-lg sm:text-xl font-bold text-slate-900 hover:text-emerald-700 transition-colors leading-snug cursor-pointer"
            >
              {hotel.hotelName}
            </h3>
            {!hotel.imageUrl && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 shrink-0 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{Number(hotel.rating).toFixed(1)}</span>
              </div>
            )}
          </div>

        {/* Linked Tourist Place info tag if available */}
        {hotel.placeDetails && (
          <div className="mb-3.5">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Near {hotel.placeDetails.placeName} ({hotel.placeDetails.city})
            </span>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-slate-700 mb-2.5 leading-relaxed">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <span>{hotel.address}</span>
        </div>

        {/* Contact Number */}
        <div className="flex items-center gap-2 text-sm text-slate-700 mb-4">
          <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
          <a
            href={`tel:${hotel.contactNumber}`}
            className="text-slate-800 hover:text-emerald-700 font-semibold transition-colors"
          >
            {hotel.contactNumber}
          </a>
        </div>
      </div>

      {/* Bottom price tag & info badge */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-600 font-semibold uppercase tracking-wider block">
            Room Tariff
          </span>
          <div className="flex items-center text-slate-900 font-extrabold text-xl">
            <IndianRupee className="w-4 h-4 text-emerald-700" />
            <span>{hotel.roomPrice.toLocaleString('en-IN')}</span>
            <span className="text-sm font-normal text-slate-600 ml-1">/ night</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDetailsClick}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>
          <a
            href={`tel:${hotel.contactNumber}`}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  );
};

export default HotelCard;
