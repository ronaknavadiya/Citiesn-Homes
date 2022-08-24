import React from "react";
import { Link } from "react-router-dom";
import rentCategotyImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategotyImage from "../assets/jpg/sellCategoryImage.jpg";

const Home = () => {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      {/* Slider */}
      <p className="exploreCategoryHeading">Categories</p>
      <div className="exploreCategories">
        <Link to="/category/rent">
          <img
            src={rentCategotyImage}
            alt="rentCategotyImage"
            className="exploreCategoryImg"
          />
          <p className="exploreCategoryName">Places for rent</p>
        </Link>
        <Link to="/category/sell">
          <img
            src={sellCategotyImage}
            alt="sellCategotyImage"
            className="exploreCategoryImg"
          />
          <p className="exploreCategoryName">Places for sell</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
