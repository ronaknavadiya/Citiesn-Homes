import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { database } from "../firebase.config";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [landLord, setLandLord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  useEffect(() => {
    const fetchLandLoard = async () => {
      try {
        const docRef = doc(database, "users", params.landlordId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          setLandLord(docSnapshot.data());
        } else {
          toast("Coudn't find landlord data..");
        }
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchLandLoard();
  }, [params.landlordId]);

  const changeHandler = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landLord !== null && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landLord?.name}</p>
          </div>
        </main>
      )}
      <form className="messageForm">
        <div className="messageDiv">
          <label htmlFor="message" className="messsageLabel">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            className="textarea"
            value={message}
            onChange={changeHandler}
          ></textarea>
        </div>
        <a
          href={`mailto:${landLord?.email}?Subject=${searchParams.get(
            "listingName"
          )}&body=${message}`}
        >
          <button className="primaryButton" type="button">
            Send Mail
          </button>
        </a>
      </form>
    </div>
  );
};

export default Contact;
