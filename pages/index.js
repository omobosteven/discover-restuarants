import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import Banner from "../components/Banner";
import Card from "../components/card";
import { useTrackLocation } from "../hooks/useTrackLocation";

import styles from "../styles/Home.module.css";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import { ACTION_TYPES, StoreContext } from "../store/storeContext";

export async function getStaticProps(context) {
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores,
    },
  };
}

export default function Home(props) {
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const {
    dispatch,
    state: { coffeeStores, latLong },
  } = useContext(StoreContext);

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  useEffect(() => {
    async function setCoffeeStoresByLocation() {
      if (latLong) {
        try {
          const res = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );
          const coffeeStores = await res.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores },
          });
          setCoffeeStoresError("");
        } catch (error) {
          setCoffeeStoresError(error.message);
        }
      }
    }

    setCoffeeStoresByLocation();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Restaurant Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="allows you to discover restaurants" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={
            isFindingLocation ? "loading..." : "View restaurants nearby"
          }
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}

        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Restaurants near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Island restaurants</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
