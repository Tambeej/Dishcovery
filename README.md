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
