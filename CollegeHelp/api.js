const fetchAdvertisement = async () => {
  const token = "your-personal-access-token";
  const repo = "your-repo-name";
  const username = "your-username";

  const url = `https://prathamu200.github.io/notification-api/advertisement.json?cache-bust=${new Date().getTime()}`;
  const headers = {
    Accept: "application/json",
  };

  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default fetchAdvertisement;
