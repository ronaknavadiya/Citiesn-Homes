import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { database } from "../firebase.config";
import Spinner from "./Spinner";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

const Slider = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      const listingRef = collection(database, "listings");
      const listingQuery = query(
        listingRef,
        orderBy("timeStamp", "desc"),
        limit(5)
      );
      const querySnapShot = await getDocs(listingQuery);

      let listings = [];
      querySnapShot.forEach((doc) => {
        listings.push({ id: doc.id, data: doc.data() });
      });

      setListings(listings);
      setLoading(false);
    };
    fetchListings();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length == 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <p className="exploreHeading">Recommended</p>
        <Swiper slidesPerView={1} pagination={{ clickable: true }}>
          {listings.map((listing) => {
            return (
              <SwiperSlide
                key={listing.id}
                onClick={() =>
                  navigate(`/category/${listing.data.type}/${listing.id}`)
                }
              >
                <div
                  className="swiperSlideDiv"
                  style={{
                    background: `url(${
                      listing?.data?.imageUrls.length > 0 &&
                      listing?.data?.imageUrls[0]
                    }) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                >
                  <p className="swiperSlideText">{listing.data.name}</p>
                  <p className="swiperSlidePrice">
                    ${listing.data.discountedPrice ?? listing.data.regularPrice}{" "}
                    {listing.data.type === "rent" && "/ Month"}
                  </p>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </>
    )
  );
};

export default Slider;
