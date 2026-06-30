async function getWeather() {
  const city = document.getElementById("city").value;

  const cityName = document.getElementById("city-name");

  const weatherInfo = document.getElementById("weather-info");

  if (city === "") {
    alert("Enter City Name");
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=e0f219885a8d29e10cd2974cf8ea4b33&units=metric`,
    );

    const data = await response.json();

    console.log(data);

    if (data.cod != 200) {
      if (data.cod == 401) {
        weatherInfo.innerHTML = "Invalid or inactive API key 🔑";
      } else if (data.cod == 404) {
        weatherInfo.innerHTML = "City Not Found ❌";
      } else {
        weatherInfo.innerHTML = `${data.message || "Something went wrong"} ⚠️`;
      }

      return;
    }

    cityName.innerHTML = data.name;

    weatherInfo.innerHTML = `
      ${data.weather[0].main} • ${data.main.temp}°C
    `;
  } catch (error) {
    weatherInfo.innerHTML = "Error Fetching Weather ❌";
  }
}
