import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import shareIcon from "../assets/svg/shareIcon.svg";
import Spinner from "../components/Spinner";
import { database } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(null);

  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const docRef = doc(database, "listings", params.listingId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          console.log(docSnapshot.data());
          setListing(docSnapshot.data());
        }
        setLoading(false);
      } catch (error) {
        toast("Couldn't get listing..");
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      {/* Slider */}

      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing?.imageUrls?.map((imageUrl, index) => {
          return (
            <SwiperSlide key={index}>
              <div
                className="swiperSlideDiv"
                style={{
                  background: `url(${imageUrl}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div
        className="shareIconDiv"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href); // use to copy to clipboard
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 3000);
        }}
      >
        <img src={shareIcon} alt="shareicon img" />
      </div>

      {shareLinkCopied && <p className="linkCopied">Link has been Copied </p>}
      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">
          For {listing.type === "rent" ? "Rent" : "Sell"}
        </p>
        {listing.offer && (
          <p className="discountPrice">
            ${listing.regularPrice - listing.discountedPrice} Discount
          </p>
        )}

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : `1 Bedroom`}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : `1 Bathroom`}
          </li>
          <li>{listing.parking && "Parking Spot"}</li>
          <li>{listing.furnished && "Furnished"}</li>
        </ul>
        <p className="listingLocationTitle">Location</p>

        <div className="leafletContainer">
          <MapContainer
            style={{ height: "100%", width: "100%" }}
            center={[listing?.geoLocation?.lat, listing?.geoLocation?.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing?.geoLocation?.lat, listing?.geoLocation?.lng]}
            >
              <Popup>{listing?.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid != listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className="primaryButton"
          >
            Contact LandLord
          </Link>
        )}
      </div>
    </main>
  );
};

export default Listing;
