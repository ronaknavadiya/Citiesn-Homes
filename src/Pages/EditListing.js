import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { v4 as uuidv4 } from "uuid";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { database } from "../firebase.config";

const EditListing = () => {
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    address,
    furnished,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(false);
  const [listing, setListing] = useState(null);

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // specific listing fetch
  useEffect(() => {
    const fetchSpecificListing = async () => {
      try {
        setLoading(true);
        const docRef = doc(database, "listings", params.listingId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          setListing(docSnapshot.data());
          setFormData({
            ...docSnapshot.data(),
            address: docSnapshot.data().location,
          });
          setLoading(false);
        } else {
          navigate("/");
          toast.error("Listing doesn't exists");
        }
      } catch (error) {
        toast.error("Couldn't fetch listing..");
        setLoading(false);
        console.log(error);
      }
    };
    fetchSpecificListing();
  }, [params.listingId, navigate]);

  // another users listing can't be edit by some another user
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can't edit that listing...");
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid }); // set User ref
        } else {
          navigate("/signIn");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  if (loading) {
    return <Spinner />;
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be lower than Regular price");
      return;
    }

    if (images.length > 10) {
      setLoading(false);
      toast.error("Max 10 Images..");
    }

    let geoLocation = {};
    let location;

    if (geoLocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = response.json();
      geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location =
        data.status === "ZERO_RESULTS"
          ? undefined
          : data.results[0].formatted_address;
      if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("Please privide valid address");
        return;
      }
    } else {
      geoLocation.lat = latitude;
      geoLocation.lng = longitude;
    }

    // Store images in firebase storage
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, "images/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log("Upload is " + progress + "% done");
          },
          (error) => {
            reject(error);
          },
          () => {
            // Handle successful uploads on complete

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((err) => {
      setLoading(false);
      toast.error("Images not uploaded - make sure file is less than 10 MB");
      return;
    });
    console.log(imageUrls);

    const validatedFormData = {
      ...formData,
      imageUrls,
      geoLocation,
      timeStamp: serverTimestamp(),
    };

    delete validatedFormData.images; // saved imageURLs
    delete validatedFormData.address; // will save it in location
    validatedFormData.location = address;
    !validatedFormData.offer && delete validatedFormData.discountedPrice;

    const docRef = doc(database, "listings", params.listingId);
    await updateDoc(docRef, validatedFormData);

    setLoading(false);
    toast.success("Listing has been edited...");
    navigate(`/category/${validatedFormData.type}/${docRef.id}`);
  };

  const handleFormChange = (e) => {
    let bool = null;

    // For Boolean values - text to real boolean values
    if (e.target.value == "true") {
      bool = true;
    }
    if (e.target.value == "false") {
      bool = false;
    }

    // For Text / Boolean / Number values - change state
    if (e.target.files) {
      setFormData((prevSatte) => ({ ...prevSatte, images: e.target.files }));
    }
    if (!e.target.files) {
      setFormData((prevSatte) => ({
        ...prevSatte,
        [e.target.id]: bool ?? e.target.value, // ?? - if values on left of ?? null then e.target.value display
      }));
    }
  };

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit a Listing</p>
      </header>
      <main>
        <form onSubmit={submitHandler}>
          <label className="formLabel">Sell / Rent</label>
          <div className="formButtons">
            <button
              type="button"
              className={type === "sell" ? "formButtonActive" : "formButton"}
              id="type"
              value="sell"
              onClick={handleFormChange}
            >
              Sell
            </button>
            <button
              type="button"
              className={type === "rent" ? "formButtonActive" : "formButton"}
              id="type"
              value="rent"
              onClick={handleFormChange}
            >
              Rent
            </button>
          </div>
          <label className="formLabel">Name</label>
          <input
            type="text"
            className="formInputName"
            id="name"
            value={name}
            onChange={handleFormChange}
            maxLength="32"
            minLength="10"
            required
          />
          <div className="formRooms flex">
            <div>
              <label className="formLabel">Bedrooms</label>
              <input
                type="number"
                className="formInputName"
                id="bedrooms"
                value={bedrooms}
                onChange={handleFormChange}
                max="50"
                min="1"
                required
              />
              <label className="formLabel">Bathrooms</label>
              <input
                type="number"
                className="formInputName"
                id="bathrooms"
                value={bathrooms}
                onChange={handleFormChange}
                max="50"
                min="1"
                required
              />
            </div>
          </div>
          <label className="formLabel">Parking Spot</label>
          <div className="formButtons">
            <button
              type="button"
              className={parking ? "formButtonActive" : "formButton"}
              id="parking"
              value={true}
              onClick={handleFormChange}
              min="1"
              max="50"
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !parking && parking !== null ? "formButtonActive" : "formButton"
              }
              id="parking"
              value={false}
              onClick={handleFormChange}
            >
              No
            </button>
          </div>
          <label className="formLabel">Furnished</label>
          <div className="formButtons">
            <button
              type="button"
              className={furnished ? "formButtonActive" : "formButton"}
              id="furnished"
              value={true}
              onClick={handleFormChange}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !furnished && furnished !== null
                  ? "formButtonActive"
                  : "formButton"
              }
              id="furnished"
              value={false}
              onClick={handleFormChange}
            >
              No
            </button>
          </div>
          <label className="formLabel">Address</label>
          <textarea
            type="text"
            className="formInputAddress"
            id="address"
            value={address}
            onChange={handleFormChange}
            required
          />
          {!geoLocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input
                  type="number"
                  className="formInputSmall"
                  id="latitude"
                  value={latitude}
                  onChange={handleFormChange}
                  required
                />
                <label className="formLabel">Longitude</label>
                <input
                  type="number"
                  className="formInputSmall"
                  id="longitude"
                  value={longitude}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>
          )}
          <label className="formLabel">Offer</label>
          <div className="formButtons">
            <button
              type="button"
              className={offer ? "formButtonActive" : "formButton"}
              id="offer"
              value={true}
              onClick={handleFormChange}
            >
              Yes
            </button>
            <button
              type="button"
              className={
                !offer && offer !== null ? "formButtonActive" : "formButton"
              }
              id="offer"
              value={false}
              onClick={handleFormChange}
            >
              No
            </button>
          </div>
          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input
              type="number"
              className="formInputSmall"
              id="regularPrice"
              value={regularPrice}
              onChange={handleFormChange}
              min="50"
              max="76000000"
              required
            />
            {type === "rent" && <p className="formPriceText">$ /Month</p>}
          </div>
          {offer && (
            <>
              <label className="formLabel">Discounted Price</label>
              <div className="formPriceDiv">
                <input
                  type="number"
                  className="formInputSmall"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={handleFormChange}
                  min="50"
                  max="76000000"
                  required={offer}
                />
                {type === "rent" && <p className="formPriceText">$ /Month</p>}
              </div>
            </>
          )}
          <label className="formLabel">Images</label>
          <p className="imageInfo">
            The first image will be the cover (max 10).
          </p>
          <input
            type="file"
            className="formInputFile"
            id="images"
            onChange={handleFormChange}
            max="10"
            multiple
            required
            accept=".jpg,.png,.jpeg"
          />
          <button className="primaryButton createListingButton" type="submit">
            Edit listing
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditListing;
