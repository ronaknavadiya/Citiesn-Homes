import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Signup from "./Pages/Signup";
import Offers from "./Pages/Offers";
import ForgotPassword from "./Pages/ForgotPassword";
import UserProfile from "./Pages/UserProfile";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import Category from "./Pages/Category";
import CreateListing from "./Pages/CreateListing";
import Listing from "./Pages/Listing";
import Contact from "./Pages/Contact";
import EditListing from "./Pages/EditListing";
import SignIn from "./Pages/SignIn";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/signIn" element={<SignIn />}></Route>
          <Route path="/signUp" element={<Signup />}></Route>
          <Route path="/offers" element={<Offers />}></Route>
          <Route path="/category/:categoryName" element={<Category />}></Route>
          <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
          <Route path="/createListing" element={<CreateListing />}></Route>
          <Route
            path="/editListing/:listingId"
            element={<EditListing />}
          ></Route>
          <Route
            path="/category/:categoryName/:listingId"
            element={<Listing />}
          ></Route>
          <Route path="/contact/:landlordId" element={<Contact />}></Route>
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<UserProfile />}></Route>
          </Route>
        </Routes>
        <Navbar />
      </Router>
      <ToastContainer />
    </>
  );
};

export default App;
