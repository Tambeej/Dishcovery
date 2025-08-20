import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div>
    <h1>Dishcovery</h1>
    <p>
       Your smart cooking companion that helps you decide what to eat based on
      your personal food preferences and the ingredients you already have at
      home
    </p>
    <Link to="/search">Lets Start</Link>
  </div>
);

export default Home;
