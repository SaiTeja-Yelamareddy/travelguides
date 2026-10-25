# TravelGuide – Tourism Information Portal

> **Tagline:** Explore. Discover. Experience.  
> **Inspiration:** SIH 2025 – Tourism Information & Travel Management (College Mini Project)

TravelGuide is a modern, responsive, full-stack MERN (MongoDB, Express.js, React, Node.js) web application built to help tourists explore verified destinations, discover nearby attractions without simulated GPS coordinates, browse matching accommodations, save personal favorites, and manage tourism data through a dedicated administrator portal.

---

## 📸 Exact Visual Design Alignment

The user interface follows the reference design guidelines:
- **Clean white backgrounds** with subtle light mint (`#ecfdf5`) sections.
- **Emerald-green primary accents** (`#059669` / `#10b981`) for active buttons, tabs, and progress milestones.
- **Dark navy typography** (`#0f172a` / `#1e293b`) using Google Fonts (*Plus Jakarta Sans* and *Caveat*).
- **Curated photography** of iconic Indian tourism destinations (Taj Mahal, Nainital, Goa, Manali, Jaipur, Alleppey, Shimla, Rameswaram).
- **Minimal, slide-out navigation drawers** for both users and administrators.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 6, Tailwind CSS, React Router v6, Lucide React icons.
- **Backend:** Node.js, Express.js REST API.
- **Database:** MongoDB Atlas / Local MongoDB via Mongoose ODM.
- **Authentication:** JWT (JSON Web Tokens) with `Bearer` authorization headers.
- **Password Security:** `bcryptjs` salted password hashing.
- **API Testing:** 100% compatible with Postman and curl.

---

## 📂 Project Architecture

```
PBL FSD/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile
│   │   ├── placesController.js   # Tourist Places CRUD and queries
│   │   ├── hotelsController.js   # Hotels CRUD and placeId filtering
│   │   ├── favoritesController.js# User favorites persistence
│   │   └── reportsController.js  # MongoDB aggregations for admin reports
│   ├── middleware/
│   │   └── auth.js               # JWT verification & adminOnly RBAC
│   ├── models/
│   │   ├── User.js               # Users collection
│   │   ├── TouristPlace.js       # TouristPlaces collection
│   │   ├── Hotel.js              # Hotels collection
│   │   └── Favorite.js           # Dedicated persistent Favorites collection
│   ├── routes/
│   │   ├── authRoutes.js         # /register, /login, /me
│   │   ├── placeRoutes.js        # /places (CRUD)
│   │   ├── hotelRoutes.js        # /hotels (CRUD)
│   │   ├── favoriteRoutes.js     # /favorites
│   │   └── reportRoutes.js       # /admin/stats, /admin/reports
│   ├── seed/
│   │   └── seedData.js           # Rich Indian tourism dataset & admin provisioning
│   ├── .env                      # Environment configuration
│   ├── .env.example              # Template without secrets
│   ├── package.json
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation with branding
│   │   │   ├── Footer.jsx        # Footer with links & copyright
│   │   │   ├── UserSidebar.jsx   # Slide-out drawer for user pages
│   │   │   ├── AdminSidebar.jsx  # Minimal 5-item admin drawer
│   │   │   ├── AdminLayout.jsx   # Admin shell wrapper
│   │   │   ├── ProgressTracker.jsx # 3-step interactive progress line
│   │   │   ├── DestinationCard.jsx # Destination grid card
│   │   │   ├── TouristPlaceCard.jsx# Step 2 nearby place card
│   │   │   ├── HotelCard.jsx     # Step 3 hotel tariff card
│   │   │   ├── ConfirmationModal.jsx # Admin delete confirmation modal
│   │   │   └── ProtectedRoute.jsx# UserRoute & AdminRoute guards
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User state & authentication
│   │   │   └── DestinationContext.jsx # Workflow state & favorite sync
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Public landing page (/)
│   │   │   ├── RegisterPage.jsx  # Split-screen registration (/register)
│   │   │   ├── LoginPage.jsx     # User / Admin switch login (/login)
│   │   │   ├── UserDashboard.jsx # Member dashboard (/dashboard)
│   │   │   ├── SelectDestination.jsx # Step 1 (/destinations)
│   │   │   ├── NearbyPlaces.jsx  # Step 2 (/nearby-places)
│   │   │   ├── PlaceDetails.jsx  # Detail view (/places/:id)
│   │   │   ├── NearbyHotels.jsx  # Step 3 (/hotels)
│   │   │   ├── FavoritesPage.jsx # Saved places (/favorites)
│   │   │   ├── ProfilePage.jsx   # User profile (/profile)
│   │   │   ├── AdminDashboard.jsx# Admin metrics (/admin/dashboard)
│   │   │   ├── AdminPlaces.jsx   # Tourist places CRUD (/admin/places)
│   │   │   ├── AdminHotels.jsx   # Hotels CRUD (/admin/hotels)
│   │   │   └── AdminReports.jsx  # Tourism reports (/admin/reports)
│   │   ├── services/
│   │   │   └── api.js            # Unified API fetch client
│   │   ├── App.jsx               # Routes setup
│   │   ├── index.css             # Tailwind and design tokens
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 🗄️ Database Models & Collections

### 1. `Users`
- `userId` (String, unique): Generated user identifier
- `name` (String): Full name of the user
- `email` (String, unique): User email address
- `password` (String): Bcrypt hashed password (minimum 6 characters)
- `role` (String): `'user'` (default) or `'admin'`

> **Security Note:** Public registration (`/register`) **strictly** assigns `role: 'user'`. Roles are never exposed in public forms.

### 2. `TouristPlaces`
- `placeId` (String, unique): E.g. `PLC_TAJ_MAHAL`
- `placeName` (String): E.g. `Taj Mahal`
- `category` (String): Historical, Hill Station, Beach, Adventure, Nature, Temple
- `city` (String): E.g. `Agra`
- `state` (String): E.g. `Uttar Pradesh`
- `description` (String): Detailed tourism description
- `visitingHours` (String): E.g. `6:00 AM - 6:30 PM (Closed on Fridays)`
- `imageUrl` (String): Photography link
- `isPopular` (Boolean): Controls landing page display

### 3. `Hotels`
- `hotelId` (String, unique): E.g. `HTL_AGRA_001`
- `placeId` (String, index): Foreign key referencing `TouristPlaces.placeId`
- `hotelName` (String): E.g. `The Oberoi Amarvilas`
- `address` (String): Full street address
- `contactNumber` (String): Contact phone number
- `roomPrice` (Number): Room tariff in ₹ per night
- `rating` (Number): 1.0 to 5.0

### 4. `Favorites` (Dedicated Persistent Collection)
- `userId` (String, index)
- `placeId` (String, index)
- Compound unique index on `{ userId, placeId }`

---

## 🔐 Pre-Provisioned Accounts

Both accounts are pre-seeded upon database connection:

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@travelguide.com` | `AdminPassword123!` | Admin Console (`/admin/*`) & Full CRUD |
| **Normal User** | `saiteja@example.com` | `Password123!` | User Dashboard, Favorites, Destination Flow |

---

## 🚀 Installation & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- Local MongoDB (`mongod`) or a MongoDB Atlas URI string

### 1. Backend Setup
```bash
cd backend
npm install
```

Configure your environment variables in `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/travelguide
JWT_SECRET=travelguide_jwt_super_secret_key_2026
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@travelguide.com
ADMIN_PASSWORD=AdminPassword123!
```

Start the backend:
```bash
npm start
# or for live reloading:
npm run dev
```
*(The server connects to MongoDB and automatically seeds initial tourist places and hotels if the database is empty).*

### 2. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open your browser at:
`http://localhost:3000`

---

## 📋 Key Pages & Workflows

1. **Landing Page (`/`):** Hero mountain lake image, popular destinations, why choose us, experiences, and responsive footer.
2. **Registration Page (`/register`):** Split-view card with Indian scenery and validation.
3. **Login Page (`/login`):** Centered card with clean pill switch for **User Login** and **Admin Login**.
4. **Step 1 - Select Destination (`/destinations`):** Progress indicator with real MongoDB search and category filtering.
5. **Step 2 - Nearby Tourist Places (`/nearby-places`):** Shows places in the selected destination area with "Change Destination" summary card.
6. **Step 3 - Nearby Hotels (`/hotels`):** Displays hotels linked to the selected placeId with contact numbers and room tariffs.
7. **Place Details (`/places/:id`):** Full information view with quick links to associated hotels.
8. **My Favorites (`/favorites`):** Reactive heart saving and MongoDB persistence.
9. **Admin Dashboard (`/admin/dashboard`):** Live counts of tourist places and hotels computed from MongoDB.
10. **Admin Manage Places (`/admin/places`):** Complete table with Add, Edit, Delete (with confirmation modal), search, and filter.
11. **Admin Manage Hotels (`/admin/hotels`):** Table with Add, Edit, Delete, and place dropdown selector.
12. **Admin Tourism Reports (`/admin/reports`):** Aggregations grouped by category, state, city, and hotel associations.
13. **Admin Sidebar:** Minimal slide-out drawer with **exactly 5 options** (Dashboard, Manage Tourist Places, Manage Hotels, Tourism Reports, Logout).
