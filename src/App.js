import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
import Signup from "./Pages/Signup";
import Offers from "./Pages/Offers";
import ForgotPassword from "./Pages/ForgotPassword";
import UserProfile from "./Pages/UserProfile";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signIn" element={<SignIn />}></Route>
        <Route path="/signUp" element={<Signup />}></Route>
        <Route path="/offers" element={<Offers />}></Route>
        <Route path="/forgotPassword" element={<ForgotPassword />}></Route>
        <Route path="/profile" element={<Signup />}></Route>
      </Routes>
      <Navbar />
    </Router>
    </>
  );
};

export default App;
