export async function getUserLocationInfo() {
  const cachedResponseKey = 'user_location_info';

  if (localStorage.getItem(cachedResponseKey)) {
    return JSON.parse(localStorage.getItem(cachedResponseKey)!);
  }

  try {
    const response = await fetch('https://ipwho.is/');

    const data = await response.json();
    const info = {
      country: data.country,
      city: data.city,
    };

    localStorage.setItem(cachedResponseKey, JSON.stringify(info));

    return info;
  } catch (error) {
    console.error('Error fetching IP location:', error);
    return null;
  }
}
