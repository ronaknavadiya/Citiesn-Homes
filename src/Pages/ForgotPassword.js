import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

const ForgotPassword = () => {
  const [email, setEmail] = useState(null);

  const onChange = (e) => {
    setEmail(e.target.value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(email);
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Email has been sent successfully..");
    } catch (error) {
      toast.error("Could not send Reset link in email");
    }
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
        <main>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              className="emailInput"
              placeholder="Email"
              id="email"
              value={email}
              onChange={onChange}
            />
            <Link className="forgotPasswordLink" to="/signIn">
              Sign In
            </Link>
            <div className="signInBar">
              <div className="signInText">Send Reset Link</div>
              <button className="signInButton" type="submit">
                <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />
              </button>
            </div>
          </form>
        </main>
      </header>
    </div>
  );
};

export default ForgotPassword;
