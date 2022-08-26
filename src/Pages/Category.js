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

const Category = () => {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsRef = collection(database, "listings");
        const queryListing = query(
          listingsRef,
          where("type", "==", params.categoryName),
          orderBy("timeStamp", "desc"),
          limit(5)
        );

        const querySnapshot = await getDocs(queryListing);

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
        setLastFetchedListing(lastVisible);

        let listings = [];
        querySnapshot.forEach((doc) => {
          listings.push({ id: doc.id, data: doc.data() });
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
  }, [params.categoryName]);

  const fetchMoreListings = async () => {
    try {
      const listingsRef = collection(database, "listings");
      const queryListing = query(
        listingsRef,
        where("type", "==", params.categoryName),
        orderBy("timeStamp", "desc"),
        startAfter(lastFetchedListing),
        limit(10)
      );

      const querySnapshot = await getDocs(queryListing);

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastFetchedListing(lastVisible);

      let listings = [];
      querySnapshot.forEach((doc) => {
        listings.push({ id: doc.id, data: doc.data() });
      });
      setListings((prevState)=> [...prevState, ...listings]);
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
        <p className="pageHeader">
          {params.categoryName == "rent"
            ? "Places for rent"
            : "Places for Sell"}
        </p>
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
        <p>No Listings for {params.categoryName}</p>
      )}
    </div>
  );
};

export default Category;
