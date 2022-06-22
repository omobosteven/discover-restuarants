import { createApi } from "unsplash-js";

// on your node server
const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "restaurant",
    page: 1,
    perPage: 40,
  });

  const unsplashResults = photos.response.results;

  return unsplashResults.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLong = "6.454601557209472,3.4269277745699807",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    getUrlForCoffeeStores(latLong, "restaurant", limit),
    options
  );
  const data = await response.json();
  // .catch((err) => console.error(err));

  return data.results.map((result) => {
    const neighborhood = result.location.locality || null;

    return {
      ...result,
      id: result.fsq_id,
      name: result.name,
      address: result.location.address || result.location.formatted_address,
      neighborhood,
      imgUrl:
        photos.length > 0
          ? photos[Math.floor(Math.random() * photos.length)]
          : "",
    };
  });
};
