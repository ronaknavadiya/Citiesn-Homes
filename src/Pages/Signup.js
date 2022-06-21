import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onValueChange = (e) => {
    setFormData((state) => ({ ...state, [e.target.id]: e.target.value }));
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome To housing world!</p>
        </header>
        <form>
          <div className="nameInputDiv">
            <input
              type="text"
              id="name"
              placeholder="name"
              value={formData.name}
              onChange={onValueChange}
              className="nameInput"
            />
          </div>
          <div className="emailInputDiv">
            <input
              type="email"
              id="email"
              placeholder="email"
              value={formData.email}
              onChange={onValueChange}
              className="emailInput"
            />
          </div>
          <div className="passwordInputDiv">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="password"
              value={formData.password}
              onChange={onValueChange}
              className="passwordInput"
            />
            <img
              src={visibilityIcon}
              alt="show password"
              onClick={() => setShowPassword((state) => !state)}
              className="showPassword"
            />
          </div>
          <Link to="/forgotPassword" className="forgotPassword">
            Forgot Password ?
          </Link>
          <div className="signUpBar">
            <p className="singUpText">Sign Up</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <Link to="/signIn" className="registerLink">
          Wanna logged in...?
        </Link>
      </div>
    </>
  );
};

export default Signup;
