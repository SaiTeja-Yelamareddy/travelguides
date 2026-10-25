const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const TouristPlace = require('../models/TouristPlace');
const Hotel = require('../models/Hotel');

dotenv.config();

const seedAllData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travelguide';
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB...');

    // 1. Seed or provision Admin User securely
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@travelguide.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await User.create({
        userId: 'USR_ADMIN_001',
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`[Seed] Created Admin: ${adminEmail} / ${adminPassword}`);
    } else {
      console.log(`[Seed] Admin already exists: ${adminEmail}`);
    }

    // Seed Demo User (Sai Teja)
    const demoEmail = 'saiteja@example.com';
    const existingDemoUser = await User.findOne({ email: demoEmail });
    if (!existingDemoUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Password123!', salt);
      await User.create({
        userId: 'USR_SAI_TEJA_002',
        name: 'Sai Teja',
        email: demoEmail,
        password: hashedPassword,
        role: 'user'
      });
      console.log(`[Seed] Created Demo User: ${demoEmail} / Password123!`);
    }

    // 2. Check if Tourist Places exist; if not, seed comprehensive data
    const placesCount = await TouristPlace.countDocuments();
    if (placesCount === 0) {
      console.log('[Seed] Seeding Tourist Places...');
      const samplePlaces = [
        {
          placeId: 'PLC_TAJ_MAHAL',
          placeName: 'Taj Mahal',
          category: 'Historical',
          city: 'Agra',
          state: 'Uttar Pradesh',
          description: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal.',
          visitingHours: '6:00 AM - 6:30 PM (Closed on Fridays)',
          imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        },
        {
          placeId: 'PLC_AGRA_FORT',
          placeName: 'Agra Fort',
          category: 'Historical',
          city: 'Agra',
          state: 'Uttar Pradesh',
          description: 'A historic Mughal fortress located 2.5 km northwest of its sister monument, the Taj Mahal. Spans 94 acres with stunning red sandstone palaces.',
          visitingHours: '6:00 AM - 6:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=800&auto=format&fit=crop&q=80',
          isPopular: false
        },
        {
          placeId: 'PLC_FATEHPUR_SIKRI',
          placeName: 'Fatehpur Sikri',
          category: 'Historical',
          city: 'Agra',
          state: 'Uttar Pradesh',
          description: 'The abandoned royal red-sandstone city founded by Emperor Akbar in 1571, home to Buland Darwaza and Salim Chishti tomb.',
          visitingHours: '6:00 AM - 6:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?w=800&auto=format&fit=crop&q=80',
          isPopular: false
        },
        {
          placeId: 'PLC_NAINITAL',
          placeName: 'Nainital',
          category: 'Hill Station',
          city: 'Nainital',
          state: 'Uttarakhand',
          description: 'A charming Himalayan resort town located around the eye-shaped volcanic Naini Lake, enveloped by oak and pine hills.',
          visitingHours: 'Open 24 Hours (Boating: 6:00 AM - 6:00 PM)',
          imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        },
        {
          placeId: 'PLC_BHIMTAL',
          placeName: 'Bhimtal Lake & Island',
          category: 'Nature',
          city: 'Nainital',
          state: 'Uttarakhand',
          description: 'A picturesque lake town near Nainital with an island aquarium in the middle, surrounded by emerald green valleys.',
          visitingHours: '9:00 AM - 6:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800&auto=format&fit=crop&q=80',
          isPopular: false
        },
        {
          placeId: 'PLC_GOA',
          placeName: 'Goa',
          category: 'Beach',
          city: 'North Goa',
          state: 'Goa',
          description: 'World-renowned coastal paradise known for pristine golden sand beaches, heritage Portuguese churches, and relaxed tropical vibes.',
          visitingHours: 'Open 24 Hours (Water sports: 9:00 AM - 6:00 PM)',
          imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        },
        {
          placeId: 'PLC_CALANGUTE',
          placeName: 'Calangute & Baga Beach',
          category: 'Beach',
          city: 'North Goa',
          state: 'Goa',
          description: 'The queen of Goan beaches featuring vibrant beach shacks, lively water adventure parasailing, jet-skiing, and seaside dining.',
          visitingHours: 'Open 24 Hours',
          imageUrl: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800&auto=format&fit=crop&q=80',
          isPopular: false
        },
        {
          placeId: 'PLC_MANALI',
          placeName: 'Manali',
          category: 'Adventure',
          city: 'Kullu',
          state: 'Himachal Pradesh',
          description: 'A high-altitude Himalayan valley town surrounded by pine forests, snow-clad peaks, mountain streams, and adventure trailheads.',
          visitingHours: 'Open 24 Hours',
          imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        },
        {
          placeId: 'PLC_SOLANG_VALLEY',
          placeName: 'Solang Valley',
          category: 'Adventure',
          city: 'Kullu',
          state: 'Himachal Pradesh',
          description: 'A premier adventure destination offering paragliding, skiing, zorbing, and quad-biking amidst giant snow-capped mountains.',
          visitingHours: '9:00 AM - 6:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&auto=format&fit=crop&q=80',
          isPopular: false
        },
        {
          placeId: 'PLC_JAIPUR',
          placeName: 'Jaipur',
          category: 'Historical',
          city: 'Jaipur',
          state: 'Rajasthan',
          description: 'The Pink City of Rajasthan, famed for majestic forts like Amber and Nahargarh, City Palace, and the intricate Hawa Mahal.',
          visitingHours: '9:00 AM - 5:30 PM',
          imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        },
        {
          placeId: 'PLC_HAWA_MAHAL',
          placeName: 'Hawa Mahal',
          category: 'Historical',
          city: 'Jaipur',
          state: 'Rajasthan',
          description: 'The Palace of Winds, an iconic five-storey pyramidal facade with 953 honeycomb windows designed for royal women.',
          visitingHours: '9:00 AM - 5:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1603288940316-24a919324545?w=800&auto=format&fit=crop&q=80',
          isPopular: false
        },
        {
          placeId: 'PLC_ALLEPPEY',
          placeName: 'Alleppey',
          category: 'Nature',
          city: 'Alappuzha',
          state: 'Kerala',
          description: 'The Venice of the East, famed for palm-shaded inland waterways, luxury houseboats, paddy fields, and peaceful backwater canals.',
          visitingHours: 'Houseboat cruises: 8:00 AM - 5:30 PM',
          imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        },
        {
          placeId: 'PLC_SHIMLA',
          placeName: 'Shimla',
          category: 'Hill Station',
          city: 'Shimla',
          state: 'Himachal Pradesh',
          description: 'The queen of hills with historic colonial architecture along The Mall, Jakhoo Hill temple, and scenic mountain views.',
          visitingHours: 'Open 24 Hours',
          imageUrl: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        },
        {
          placeId: 'PLC_RAMESWARAM',
          placeName: 'Rameswaram',
          category: 'Temple',
          city: 'Rameswaram',
          state: 'Tamil Nadu',
          description: 'Sacred coastal temple town renowned for Ramanathaswamy Temple’s thousand-pillar hall, sacred Agni Theertham, and Pamban bridge.',
          visitingHours: '5:00 AM - 1:00 PM, 3:00 PM - 9:00 PM',
          imageUrl: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?w=800&auto=format&fit=crop&q=80',
          isPopular: true
        }
      ];

      await TouristPlace.insertMany(samplePlaces);
      console.log(`[Seed] Successfully inserted ${samplePlaces.length} tourist places.`);
    }

    // 3. Seed Hotels linked to TouristPlaces
    const hotelsCount = await Hotel.countDocuments();
    if (hotelsCount === 0) {
      console.log('[Seed] Seeding Hotels...');
      const sampleHotels = [
        // Taj Mahal / Agra Hotels
        {
          hotelId: 'HTL_AGRA_001',
          placeId: 'PLC_TAJ_MAHAL',
          hotelName: 'The Oberoi Amarvilas Agra',
          address: 'Taj East Gate Road, Tajganj, Agra, Uttar Pradesh 282001',
          contactNumber: '+91 562 223 1504',
          roomPrice: 28500,
          rating: 4.9,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_AGRA_002',
          placeId: 'PLC_TAJ_MAHAL',
          hotelName: 'ITC Mughal, A Luxury Collection Hotel',
          address: 'Tajganj, Fatehabad Road, Agra, Uttar Pradesh 282001',
          contactNumber: '+91 562 402 1700',
          roomPrice: 8500,
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_AGRA_003',
          placeId: 'PLC_TAJ_MAHAL',
          hotelName: 'Tajview - IHCL SeleQtions',
          address: 'Fatehabad Road, Tajganj, Agra, Uttar Pradesh 282001',
          contactNumber: '+91 562 660 2000',
          roomPrice: 5200,
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_AGRA_004',
          placeId: 'PLC_AGRA_FORT',
          hotelName: 'Grand Imperial Heritage Hotel',
          address: 'M.G. Road, Rakabganj, Agra, Uttar Pradesh 282001',
          contactNumber: '+91 562 242 0101',
          roomPrice: 4200,
          rating: 4.4,
          imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80'
        },
        // Nainital Hotels
        {
          hotelId: 'HTL_NAINI_001',
          placeId: 'PLC_NAINITAL',
          hotelName: 'The Naini Retreat Heritage Hotel',
          address: 'Ayarpatta Slopes, Mallital, Nainital, Uttarakhand 263002',
          contactNumber: '+91 5942 235 105',
          roomPrice: 7800,
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_NAINI_002',
          placeId: 'PLC_NAINITAL',
          hotelName: 'Manu Maharani Lake Resort',
          address: 'Grassmere Estate, Mallital, Nainital, Uttarakhand 263001',
          contactNumber: '+91 5942 237 342',
          roomPrice: 6500,
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_NAINI_003',
          placeId: 'PLC_BHIMTAL',
          hotelName: 'Country Inn Nature Resort Bhimtal',
          address: 'Mehragaon, Bhowali-Bhimtal Road, Uttarakhand 263136',
          contactNumber: '+91 5942 247 000',
          roomPrice: 4800,
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=80'
        },
        // Goa Hotels
        {
          hotelId: 'HTL_GOA_001',
          placeId: 'PLC_GOA',
          hotelName: 'Taj Fort Aguada Resort & Spa',
          address: 'Sinquerim, Candolim, North Goa, Goa 403515',
          contactNumber: '+91 832 664 5858',
          roomPrice: 16500,
          rating: 4.8,
          imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_GOA_002',
          placeId: 'PLC_GOA',
          hotelName: 'W Goa Tropical Beachfront Resort',
          address: 'Vagator Beach, Bardez, North Goa, Goa 403509',
          contactNumber: '+91 832 671 8888',
          roomPrice: 21000,
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_GOA_003',
          placeId: 'PLC_CALANGUTE',
          hotelName: 'Hard Rock Hotel Goa Calangute',
          address: 'Bishop Alex Dias Road, Calangute, Goa 403516',
          contactNumber: '+91 832 674 5555',
          roomPrice: 7200,
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop&q=80'
        },
        // Manali Hotels
        {
          hotelId: 'HTL_MANALI_001',
          placeId: 'PLC_MANALI',
          hotelName: 'The Himalayan Luxury Castle & Resort',
          address: 'Hadimba Road, Manali, Himachal Pradesh 175131',
          contactNumber: '+91 1902 250 999',
          roomPrice: 12500,
          rating: 4.8,
          imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_MANALI_002',
          placeId: 'PLC_MANALI',
          hotelName: 'Span Resort & Spa Riverfront',
          address: 'Baragran, Manali Highway, Kullu, Himachal Pradesh 175129',
          contactNumber: '+91 1902 240 538',
          roomPrice: 14000,
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_MANALI_003',
          placeId: 'PLC_SOLANG_VALLEY',
          hotelName: 'Solang Valley Alpine Resort',
          address: 'Solang Valley, Palchan, Manali, Himachal Pradesh 175103',
          contactNumber: '+91 1902 256 001',
          roomPrice: 6200,
          rating: 4.4,
          imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=80'
        },
        // Jaipur Hotels
        {
          hotelId: 'HTL_JAIPUR_001',
          placeId: 'PLC_JAIPUR',
          hotelName: 'Rambagh Palace Heritage Luxury Hotel',
          address: 'Bhawani Singh Road, Jaipur, Rajasthan 302005',
          contactNumber: '+91 141 238 5700',
          roomPrice: 32000,
          rating: 5.0,
          imageUrl: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_JAIPUR_002',
          placeId: 'PLC_JAIPUR',
          hotelName: 'Samode Haveli Boutique Heritage Stay',
          address: 'Gangapole, Old City, Jaipur, Rajasthan 302002',
          contactNumber: '+91 141 263 2407',
          roomPrice: 9500,
          rating: 4.7,
          imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80'
        },
        // Alleppey Hotels
        {
          hotelId: 'HTL_ALLEPPEY_001',
          placeId: 'PLC_ALLEPPEY',
          hotelName: 'Kumarakom Lake Resort & Houseboats',
          address: 'Vayitharamattom, Kumarakom, Alappuzha, Kerala 686563',
          contactNumber: '+91 481 252 4900',
          roomPrice: 18500,
          rating: 4.9,
          imageUrl: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&auto=format&fit=crop&q=80'
        },
        {
          hotelId: 'HTL_ALLEPPEY_002',
          placeId: 'PLC_ALLEPPEY',
          hotelName: 'Punnamada Lake Backwater Resort',
          address: 'Punnamada, Alappuzha, Kerala 688006',
          contactNumber: '+91 477 223 3690',
          roomPrice: 7500,
          rating: 4.6,
          imageUrl: 'https://images.unsplash.com/photo-1582610116397-edb318620fdb?w=800&auto=format&fit=crop&q=80'
        },
        // Shimla Hotels
        {
          hotelId: 'HTL_SHIMLA_001',
          placeId: 'PLC_SHIMLA',
          hotelName: 'Wildflower Hall, An Oberoi Resort Shimla',
          address: 'Chharabra, Shimla, Himachal Pradesh 171012',
          contactNumber: '+91 177 264 8585',
          roomPrice: 26000,
          rating: 4.9,
          imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80'
        },
        // Rameswaram Hotels
        {
          hotelId: 'HTL_RAMES_001',
          placeId: 'PLC_RAMESWARAM',
          hotelName: 'Daiwik Hotels Rameswaram',
          address: 'NH-49, Near Rameswaram Bus Stand, Tamil Nadu 623526',
          contactNumber: '+91 4573 223 222',
          roomPrice: 4200,
          rating: 4.5,
          imageUrl: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=800&auto=format&fit=crop&q=80'
        }
      ];

      await Hotel.insertMany(sampleHotels);
      console.log(`[Seed] Successfully inserted ${sampleHotels.length} hotels.`);
    }

    console.log('[Seed] Database initialization and seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

// If run directly via node seedData.js
if (require.main === module) {
  seedAllData().then(() => {
    mongoose.connection.close();
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}

module.exports = seedAllData;
