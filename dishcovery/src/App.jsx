import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import rootStore from './stores/rootStore';
// import Header from './components/Header';
// import Footer from './components/Footer';
import Home from './pages/Home';
// import Login from './pages/Login';
import Search from './pages/Search';
// import Recipe from './pages/Recipe';
// import Ingredients from './pages/Ingredients';
// import Favorites from './pages/Favorites';
// import Blog from './pages/Blog';
// import Contact from './pages/Contact';
import './App.css';


function App() {
  return (
    <Provider {...rootStore}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <TopBar isLoggedIn={rootStore.user.isLoggedIn} userName={rootStore.user.name} />
          <Header />
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} /> */}
              <Route path="/search" element={<Search />} />
              {/* <Route path="/recipe/:id" element={<Recipe />} />
              <Route path="/ingredients/:name" element={<Ingredients />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} /> */}
            </Routes>
          </main>
          {/* <Footer /> */}
        </div>
      </Router>
    </Provider>
  );
}

export default App;
