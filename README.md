🍳 Dishcovery

Dishcovery is your smart cooking companion that helps you decide what to cook based on the ingredients you already have at home and your personal food preferences.
It integrates recipe search, personalized recommendations, and ingredient-based filtering into a sleek, React-powered web app.

🔧 Tech Stack

Frontend: React + Vite

Styling: CSS modules (component-scoped styles)

State Management: Custom stores (ingredientStore, recipeStore, userStore, rootStore)

Backend/DB: Supabase (auth + persistence)

API Integration: MealDB API wrapper (services/api.js)

Auth: Supabase Auth + context provider (auth/AuthProvider.jsx)

Routing & Protection: React Router + custom ProtectedRoute

📂 Project Structure
dishcovery/
├─ .env.local              # Environment variables (API keys, Supabase credentials)
├─ index.html              # Root HTML file
├─ vite.config.js          # Vite config
├─ public/                 # Static assets (images, SVGs, logos, backgrounds)
│  ├─ img/bg               # Backgrounds (hero, light, greenBG)
│  ├─ img/categories       # Category icons (vegan, beef, dessert, etc.)
│  ├─ img/logo             # App logos
│  └─ img/svg              # SVG icons for auth & user actions
└─ src/
   ├─ App.jsx              # Root app
   ├─ main.jsx             # Entry point
   ├─ index.css            # Global styles
   ├─ auth/                # Auth logic
   │  ├─ AuthProvider.jsx
   │  └─ ProtectedRoute.jsx
   ├─ boot/                # Bootstrapping helpers
   │  └─ AuthBridge.jsx
   ├─ components/          # Reusable UI components
   │  ├─ Navbar, Footer, Header, TopBar
   │  ├─ RecipeCard, RandomMeals, LatestMeals
   │  ├─ Inputs (AreaInput, CategoryInput, IngredientInput, DishNameInput, CountryInput)
   │  └─ Helpers (LoadingSpinner, ErrorMessage, FilterSelect, Preferences)
   ├─ pages/               # Route pages
   │  ├─ Home, Recipe, IngredientPage
   │  ├─ Login, Profile, Favorites
   │  ├─ Blog, Contact, Terms
   │  └─ ComingSoon, Dev
   ├─ services/            # API & storage services
   │  ├─ api.js            # MealDB API fetchers
   │  ├─ db.js             # DB utilities
   │  ├─ localStorage.js   # Local persistence
   │  └─ supabase.js       # Supabase client
   ├─ stores/              # App state stores
   │  ├─ ingredientStore.js
   │  ├─ recipeStore.js
   │  ├─ userStore.js
   │  └─ rootStore.js
   └─ utils/
      └─ scrollToSection.js

🚀 Getting Started
1. Clone the repo
git clone https://github.com/<your-username>/dishcovery.git
cd dishcovery

2. Install dependencies
npm install

3. Setup environment

Create a .env.local file:

VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_KEY=your-supabase-key
VITE_MEALDB_API=https://www.themealdb.com/api/json/v1/1

4. Run development server
npm run dev

5. Build for production
npm run build

🧩 Core Features

Ingredient Search → find meals with what you already have

Dietary Preferences → vegan, vegetarian, meat-friendly filters

Random Meals → get 5 new suggestions on demand

Latest Recipes → auto-fetched from API

Favorites → save & persist recipes

User Auth → signup/login with Supabase

Responsive UI → mobile-first with flexbox and CSS

🛠 Developer Notes

Components are split into components/ (UI building blocks) and pages/ (route-level containers).

State management is centralized under stores/ for scalability.

API calls should go through services/api.js to keep fetch logic consistent.

Protected routes (e.g. Favorites/Profile) use ProtectedRoute.jsx wrapper.

CSS is component-scoped for maintainability.

🤝 Contributing

Fork this repo

Create a new branch (feat/my-feature)

Commit changes with clear messages

Push branch & open PR

📜 License

MIT License © 2025 Dishcovery Team

👉 Would you like me to also add API usage documentation (like example calls from services/api.js), so contributors instantly know how to query MealDB from inside the project?

Вы сказали:
developer-focused please
ChatGPT сказал:

Got it 🚀 Since you want a developer-focused README, we’ll keep it clean, technical, and structured for contributors. Here's a polished draft for your README.md:

🍳 Dishcovery

Dishcovery is a smart cooking companion built with React + Vite. It helps users discover recipes based on available ingredients, dietary preferences, and cravings. The app integrates with external APIs and supports authentication, personalized searches, and favorites management.

⚙️ Tech Stack

Frontend: React 18, Vite, React Router, Swiper

State Management: Custom stores (ingredientStore, recipeStore, userStore)

Auth & Backend: Supabase (Auth + DB)

Styling: CSS modules (per component)

Other: LocalStorage persistence, responsive UI, modular component architecture

📂 Project Structure
dishcovery/
├─ public/               # Static assets (images, SVGs, logos, backgrounds)
├─ src/
│  ├─ auth/              # Auth provider & protected route wrapper
│  ├─ boot/              # Bootstrapping (AuthBridge, etc.)
│  ├─ components/        # Reusable UI components (cards, inputs, navbar, etc.)
│  ├─ pages/             # Route-level views (Home, Recipe, Profile, etc.)
│  ├─ services/          # API integrations (MealDB, Supabase, LocalStorage)
│  ├─ stores/            # Global state management
│  ├─ utils/             # Small helpers (scrollToSection, etc.)
│  ├─ App.jsx            # Main app entry point
│  ├─ main.jsx           # Vite entry
├─ .env.local            # Environment variables (API keys, Supabase URL)
├─ vite.config.js        # Vite configuration
├─ package.json          # Dependencies & scripts
└─ README.md             # This file

🚀 Getting Started
1. Clone the repo
git clone https://github.com/YOUR_USERNAME/dishcovery.git
cd dishcovery

2. Install dependencies
npm install

3. Set up environment

Create a .env.local file in the root:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_MEALDB_API=https://www.themealdb.com/api/json/v1/1

4. Run dev server
npm run dev


App will be available at http://localhost:5173/.

🧩 Features

🔐 Authentication (signup, login, logout) with Supabase

🍽️ Search by ingredient, dish name, area, or category

🎲 Random & latest meal suggestions

❤️ Favorites system (persisted per user)

📚 Blog, Contact, and static pages

📱 Responsive UI (Swiper, grid layouts)

🛠️ Development Notes

Each component has its own CSS for maintainability

API logic is centralized under src/services/

State is organized in src/stores/ using custom stores for reactivity

Authentication context (AuthProvider) wraps the app

Recipes are fetched from TheMealDB API

📌 Roadmap

 Add meal planner (weekly schedule)

 Improve search filters (nutritional info, allergens)

 Offline mode with IndexedDB

 Dark mode toggle

🤝 Contributing

Fork the repo

Create a feature branch (git checkout -b feature/your-feature)

Commit changes (git commit -m "Add: your feature")

Push (git push origin feature/your-feature)

Open a Pull Request

📜 License

MIT License © 2025 Dishcovery