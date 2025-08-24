import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "mobx-react";
import rootStore from "./stores/rootStore";
// import Header from './components/Header';
import Footer from './components/Footer';
import Home from "./pages/Home";
import TopBar from "./components/TopBar";
import Login from "./pages/Login";
// import Search from "./components/Search";
import Profile from "./pages/Profile";
import { AuthProvider } from "./auth/AuthProvider";
// import Ingredients from './pages/Ingredients';
import IngredientPage from "./pages/IngredientPage";
import ProtectedRoute from "./auth/protectedRoute";
// import Favorites from './pages/Favorites';
// import Blog from './pages/Blog';
// import Contact from './pages/Contact';
import Recipe from "./pages/Recipe";
import RecipesPage from "./pages/RecipesPage";
import Terms from "./pages/Terms";
import "./App.css";
import AuthBridge from "./boot/AuthBridge";
import user from "./stores/userStore";

function App() {
  return (
    <AuthProvider>
      <Provider {...rootStore}>
        <Router>
          <AuthBridge />
          <div className="min-h-screen flex flex-col">
            <TopBar />
            {/* <Header /> */}
            <main className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<Recipe />} />
                <Route path="/category/:category" element={<RecipesPage />} />

                <Route path="/ingredients/:name" element={<IngredientPage />} />
                <Route path="/recipes/ingredient/:ingredient" element={<RecipesPage />} />
                <Route path="/terms" element={<Terms />} />

                {/* <Route path="/search" element={<RecipesPage />} />           */}
                {<Route path="/login" element={<Login />} />}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                {/*<Route path="/favorites" element={<Favorites />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} /> */}

              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </Provider>
    </AuthProvider>
  );
}

export default App;
