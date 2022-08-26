import React, { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../firebase.config";
import { toast } from "react-toastify";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";
import { async } from "@firebase/util";

const UserProfile = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [updateUser, setUpdateUser] = useState(false);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const submitHandler = async () => {
    try {
      // for Auth
      if (auth.currentUser.displayName !== formData.name) {
        await updateProfile(auth.currentUser, { displayName: formData.name });
      }
      // for firestore
      const userRef = doc(database, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name: formData.name });
      toast("User name has been Updated successfully...");
    } catch (error) {
      toast.error("Could not update profile Details...");
    }
  };

  const DeleteListing = async (listingId) => {
    try {
      if (window.confirm("Are you sure you want to delete ? ")) {
        await deleteDoc(doc(database, "listings", listingId));
        const updatedListings = listings.filter(
          (listing) => listing.id !== listingId
        );
        setListings(updatedListings);
        toast.success("Listing Deleted successfully");
      }
    } catch (error) {
      toast.error("Coudn't delete ..");
    }
  };

  useEffect(() => {
    const fetchUserListing = async () => {
      try {
        setLoading(true);
        const listingsRef = collection(database, "listings");
        const queryListing = query(
          listingsRef,
          where("userRef", "==", auth.currentUser.uid),
          // orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(queryListing);
        let listings = [];
        querySnapshot.forEach((doc) => {
          console.log("...",doc.data());
          listings.push({ id: doc.id, data: doc.data() });
        });
        setListings(listings);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserListing();
  }, [auth.currentUser.uid]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Log Out
        </button>
      </header>
      <main>
        <div className="profileDetialsHeader">
          <p className="profileDetailsText">
            Personal Details
            <p
              className="changePersonalDetails"
              onClick={() => {
                updateUser && submitHandler();
                setUpdateUser((prevState) => !prevState);
              }}
            >
              {updateUser ? " done" : "change"}
            </p>
          </p>
        </div>
        <div className="profileCard">
          <form>
            <input
              type="text"
              id="name"
              className={!updateUser ? "profileName" : "profileNameActive"}
              disabled={!updateUser}
              value={formData.name}
              onChange={onChange}
            />
            <input
              type="text"
              id="email"
              className={!updateUser ? "profileEmail" : "profileEmailActive"}
              // disabled={!updateUser}
              disabled={true}
              value={formData.email}
              onChange={onChange}
            />
          </form>
        </div>
        <Link to="/createListing" className="createListing">
          <img src={homeIcon} alt="home" />
          <p>Sell or Rent your home</p>
          <img src={arrowRight} alt="Arrow right" />
        </Link>
        {!loading && listings?.length > 0 && (
          <>
            <p className="listingText">Your Listing</p>
            <ul className="listingsList">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    listing={listing.data}
                    id={listing.id}
                    onDelete={() => DeleteListing(listing.id)}
                  />
                );
              })}
            </ul>
          </>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
