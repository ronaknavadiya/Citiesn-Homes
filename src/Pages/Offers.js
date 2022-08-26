import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { database } from "../firebase.config";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);


  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(database, "listings");

        const listingQuery = query(
          listingsRef,
          where("offer", "==", true),
          orderBy("timeStamp", "desc"),
          limit(10)
        );

        const querySnapshot = await getDocs(listingQuery);

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let listings = [];

        querySnapshot.forEach((doc) => {
          return listings.push({ id: doc.id, data: doc.data() });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error("Couldn't fetch listings");
        setLoading(false);
        console.log(error);
      }
    };

    fetchListings();
  }, []);

   const fetchMoreListings = async () => {
     try {
       const listingsRef = collection(database, "listings");

       const listingQuery = query(
         listingsRef,
         where("offer", "==", true),
         orderBy("timeStamp", "desc"),
         startAfter(lastFetchedListing),
         limit(10)
       );

       const querySnapshot = await getDocs(listingQuery);

       let listings = [];

       querySnapshot.forEach((doc) => {
         return listings.push({ id: doc.id, data: doc.data() });
       });

       setListings((prevState) => [...prevState, ...listings]);
       setLoading(false);
     } catch (error) {
       toast.error("Couldn't fetch listings");
       setLoading(false);
       console.log(error);
     }
   };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => {
                return (
                  <ListingItem
                    key={listing.id}
                    id={listing.id}
                    listing={listing.data}
                  />
                );
              })}
            </ul>
          </main>
          <br />
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={fetchMoreListings}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No current offers, Please explore from home page..</p>
      )}
    </div>
  );
};

export default Offers;
