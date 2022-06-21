import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePage = (route) => {
    if (route == location.pathname) {
      return true;
    }
    return false;
  };
  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreIcon
              fill={isActivePage("/") ? "#2c2c2c" : "#8f8f8f"}
              width="36px"
              height="36px"
            />
            <p
              className={
                isActivePage("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offers")}>
            <OfferIcon
              fill={isActivePage("/offers") ? "#2c2c2c" : "#8f8f8f"}
              width="36px"
              height="36px"
            />
            <p
              className={
                isActivePage("/offers")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Offer
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <PersonOutlineIcon
              fill={isActivePage("/profile") ? "#2c2c2c" : "#8f8f8f"}
              width="36px"
              height="36px"
            />
            <p
              className={
                isActivePage("/profile")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Navbar;
