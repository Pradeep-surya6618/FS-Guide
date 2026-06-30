//API KEY https://www.omdbapi.com/apikey.aspx?utm_source=chatgpt.com

async function getMovie() {

  const movie = document.getElementById("movie").value;

  const result = document.getElementById("result");

  if(movie === ""){

    result.innerHTML = `
      <p>Enter Movie Name 🎬</p>
    `;

    return;
  }

  result.innerHTML = `
    <p>Loading... ⏳</p>
  `;

  try {

    const response = await fetch(
      `https://www.omdbapi.com/?t=${movie}&apikey=39e3ec3e`
    );

    const data = await response.json();

    console.log(data);

    if(data.Response === "False"){

      result.innerHTML = `
        <p>Movie Not Found ❌</p>
      `;

      return;
    }

    result.innerHTML = `
    
      <img src="${data.Poster}" />

      <h2>${data.Title}</h2>

      <p>⭐ Rating: ${data.imdbRating}</p>

      <p>📅 Year: ${data.Year}</p>

      <p>🎭 Genre: ${data.Genre}</p>

    `;

  } catch(error){

    result.innerHTML = `
      <p>Error Fetching Movie ❌</p>
    `;
  }

}