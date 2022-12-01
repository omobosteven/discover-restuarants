const getRestaurantPhoto = async (fsqId) => {
  const response = await fetch(
    `https://api.foursquare.com/v3/places/${fsqId}/photos?limit=1`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      },
    }
  );

  const data = await response.json();
  const photo = data[0];

  if (!photo) {
    return "";
  }

  const photoUrl = `${photo?.prefix}500x500${photo?.suffix}`;

  return photoUrl || "";
};

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

export const fetchCoffeeStores = async (
  latLong = "6.454601557209472,3.4269277745699807",
  limit = 9
) => {
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

  return Promise.all(
    data.results.map(async (result) => {
      const neighborhood = result.location.locality || null;

      return {
        ...result,
        id: result.fsq_id,
        name: result.name,
        address: result.location.address || result.location.formatted_address,
        neighborhood,
        imgUrl: await getRestaurantPhoto(result.fsq_id),
      };
    })
  );
};
