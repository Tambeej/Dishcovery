import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "mobx-react";
import rootStore from "./stores/rootStore";
// import Header from './components/Header';
import Footer from './components/Footer';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Search from "./components/Search";
import Profile from "./pages/Profile";
import { AuthProvider } from "./auth/AuthProvider";
// import Ingredients from './pages/Ingredients';
// import Favorites from './pages/Favorites';
// import Blog from './pages/Blog';
// import Contact from './pages/Contact';
import Recipe from "./pages/Recipe";
import RecipesPage from "./pages/RecipesPage";
import Terms from "./pages/Terms";
import "./App.css";
import TopBar from "./components/TopBar";
import AuthBridge from "./boot/AuthBridge";
function App() {
  return (
    <AuthProvider>
      <Provider {...rootStore}>
        <Router>
          <AuthBridge />
          <div className="min-h-screen flex flex-col">
            {
              <TopBar
                isLoggedIn={rootStore.userStore.isLoggedIn}
                userName={rootStore.userStore.name}
              />
            }
            {/* <Header /> */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/recipe/:id" element={<Recipe />} />
                <Route path="/category/:category" element={<RecipesPage />} />

                {/* <Route path="/ingredients/:name" element={<Ingredients />} />
                <Route path="/recipes/ingredient/:ingredient" element={<RecipesPage />} /> */}
                <Route path="/terms" element={<Terms />} />

                {/* <Route path="/search" element={<RecipesPage />} />           */}
                {<Route path="/login" element={<Login />} />}
                <Route path="/profile" element={<Profile />} />
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
