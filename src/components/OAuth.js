import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg";
import { database } from "../firebase.config";

const OAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const loginUsingGoogle = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check if user is already in firestore database or not
      const userRef = doc(database, "users", user.uid);
      const docSnapShot = await getDoc(userRef);
      if (!docSnapShot.exists()) {
        await setDoc(doc(database, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          timeStamp: serverTimestamp(),
        });
      }
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Please provide valid credentials..");
    }
  };

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === "signUp" ? "up" : "in"} with</p>
      <button className="socialIconDiv" onClick={loginUsingGoogle}>
        <img src={googleIcon} alt="google Link" className="socialIconImg" />
      </button>
    </div>
  );
};

export default OAuth;
