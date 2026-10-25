const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Hotel = require('../models/Hotel');

const hotelImages = {
  'The Oberoi Amarvilas Agra': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
  'ITC Mughal, A Luxury Collection Hotel': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
  'Tajview - IHCL SeleQtions': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
  'Grand Imperial Heritage Hotel': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
  'The Naini Retreat Heritage Hotel': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80',
  'Manu Maharani Lake Resort': 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80',
  'Country Inn Nature Resort Bhimtal': 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80',
  'Taj Fort Aguada Resort & Spa': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
  'W Goa Tropical Beachfront Resort': 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80',
  'Hard Rock Hotel Goa Calangute': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80',
  'The Himalayan Luxury Castle & Resort': 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&auto=format&fit=crop&q=80',
  'Span Resort & Spa Riverfront': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=80',
  'Solang Valley Alpine Resort': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80',
  'Rambagh Palace Heritage Luxury Hotel': 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80',
  'Samode Haveli Boutique Heritage Stay': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
  'Kumarakom Lake Resort & Houseboats': 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&auto=format&fit=crop&q=80',
  'Punnamada Lake Backwater Resort': 'https://images.unsplash.com/photo-1582610116397-edb318620fdb?w=800&auto=format&fit=crop&q=80',
  'Wildflower Hall, An Oberoi Resort Shimla': 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80',
  'Daiwik Hotels Rameswaram': 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&auto=format&fit=crop&q=80'
};

const defaultHotelImage = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';

async function updateAllHotels() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travelguide';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const hotels = await Hotel.find();
    console.log(`Found ${hotels.length} hotels in database.`);

    let updatedCount = 0;
    for (const hotel of hotels) {
      const targetUrl = hotelImages[hotel.hotelName] || hotel.imageUrl || defaultHotelImage;
      if (hotel.imageUrl !== targetUrl) {
        hotel.imageUrl = targetUrl;
        await hotel.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} hotels with imageUrl.`);
  } catch (err) {
    console.error('Error updating hotels:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateAllHotels();
