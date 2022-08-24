import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { database, dbdatabase } from "../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import OAuth from "../components/OAuth";

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

  const createUser = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredentials.user;
      updateProfile(auth.currentUser, { displayName: formData.name });

      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();

      await setDoc(doc(database, "users", user.uid), formDataCopy);
      toast("User created successfully");
      navigate("/");
    } catch (error) {
      toast.erorr("Error: Please try again...");
      console.log("Error:", error);
    }
  };

  return (
    <>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome To housing world!</p>
        </header>
        <form onSubmit={createUser}>
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
          <Link to="/forgotPassword" className="forgotPasswordLink">
            Forgot Password ?
          </Link>
          <div className="signUpBar">
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
            </button>
          </div>
        </form>
        <OAuth />
        <Link to="/signIn" className="registerLink">
          Wanna logged in...?
        </Link>
      </div>
    </>
  );
};

export default Signup;
