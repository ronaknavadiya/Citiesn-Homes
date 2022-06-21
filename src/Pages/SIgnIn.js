import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
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
          <p className="pageHeader">Welcome Back!</p>
        </header>
        <form>
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
          <div className="signInBar">
            <p className="singInText">Sign In</p>
            <button className="signInButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <Link to="/signUp" className="registerLink">
          Create new Account?
        </Link>
      </div>
    </>
  );
};

export default SignIn;
