import React from "react";
import "./ComingSoon.css";

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <div className="chef-hat">👨‍🍳</div>
      <h1>Something Delicious is Cooking...</h1>
      <p>Our recipes are marinating. Hang tight, it's almost ready!</p>
      <div className="cooking-animation">
        <div className="pot">
          <span className="steam">💨</span>
          <span className="steam">💨</span>
          <span className="steam">💨</span>
        </div>
      </div>
      <p className="funny-note">
        P.S. We promise it won’t be another bland website. 🍕🍩🍔
      </p>
    </div>
  );
};

export default ComingSoon;
