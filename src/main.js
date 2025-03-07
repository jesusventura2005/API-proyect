import NiceSelect from "nice-select2";
import { APIKEY } from "./secret";

document.addEventListener("DOMContentLoaded", function () {
  const outDescription = document.querySelector(".out_description");
  const containerDescription = document.querySelector(".conatiner_description");
  const section = document.querySelector("section");
  const selectElement = document.getElementById("a-select");
  const selectCategory = document.getElementById("categorie_select");
  const description = document.querySelector(".description");
  const search = document.querySelector("#search");

  let page = 1;

  window.addEventListener("scroll", () => {
    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight
    );
    const windowHeight = window.innerHeight;
    const scrollY = window.scrollY;

    if (scrollY + windowHeight >= scrollHeight - 10) {
      page++;
      renderMovies(page);
    }
  });

  new NiceSelect(selectElement);
  let niceSelectCategory = new NiceSelect(selectCategory);

  let content = selectElement.value;
  let categorie = "";

  const handleSelectChange = () => {
    const divsAEliminar = section.querySelectorAll("div#divmovie");
    divsAEliminar.forEach((div) => div.remove());
    renderMovies(1);
  };

  const handleSearchChange = (word) => {
    const divsAEliminar = section.querySelectorAll("div#divmovie");
    divsAEliminar.forEach((div) => div.remove());
    renderSearchMovies(word);
  };

  search.addEventListener("keyup", () => {
    let word = search.value;

    console.log(word.length);

    if (word.length == 0) {
      handleSelectChange();
    } else {
      handleSearchChange(word);
    }
  });

  selectCategory.addEventListener("change", function () {
    categorie = selectCategory.value;
    handleSelectChange();
  });

  selectElement.addEventListener("change", async function () {
    niceSelectCategory.destroy();
    content = selectElement.value;
    await changeCategories();
    handleSelectChange();
  });

  const BASE_URL = "https://api.themoviedb.org/3/";

  const fetchData = async (api) => {
    try {
      const res = await fetch(api);
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const changeCategories = async () => {
    const data = await fetchData(
      `${BASE_URL}genre/${content}/list?api_key=${APIKEY}&language=es-ES`
    );

    if (data && data.genres) {
      selectCategory.innerHTML = ""; // Limpiar las opciones anteriores

      data.genres.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        selectCategory.append(option);
      });

      // Esperar un pequeño tiempo antes de reinicializar NiceSelect

        niceSelectCategory = new NiceSelect(selectCategory);

    } else {
      console.log("No se pudieron obtener las categorías");
    }
  };

  const createDescription = (voteAverage, voteCount, overview, backdrop) => {
    const imgMovieDescription = document.createElement("div");
    const textMovieDescription = document.createElement("p");
    const descriptiondiv = document.createElement("div");
    const containerRate = document.createElement("div");
    const rateDiv = document.createElement("div");
    const stardiv = document.createElement("div");
    const vote_count = document.createElement("p");
    const vote_average = document.createElement("p");
    const addBotton = document.createElement("button");
    addBotton.id = "addBotton";
    addBotton.textContent = "ADD";

    const bottonContainer = document.createElement("div");
    bottonContainer.id = "bottonContainer";
    vote_average.textContent = (voteAverage / 2).toFixed(1);
    vote_count.textContent = voteCount;

    rateDiv.appendChild(vote_average);
    rateDiv.appendChild(vote_count);

    const starCount = Math.round(voteAverage / 2); //
    const totalStars = 5;
    for (let i = 0; i < totalStars; i++) {
      const starImg = document.createElement("img");
      if (i < starCount) {
        starImg.src = "./img/Vector.svg";
      } else {
        starImg.src = "./img/empty_star.svg";
      }
      starImg.alt = "Star";
      stardiv.appendChild(starImg);
    }

    bottonContainer.appendChild(addBotton);
    textMovieDescription.id = "textMovieDescription";
    imgMovieDescription.id = "imgMovieDescription";
    descriptiondiv.id = "description_div";
    imgMovieDescription.style.backgroundImage = backdrop;
    textMovieDescription.textContent = overview;

    containerRate.appendChild(rateDiv);
    containerRate.appendChild(stardiv);
    stardiv.id = "stardiv";
    rateDiv.id = "rateDiv";
    containerRate.id = "containerRate";

    descriptiondiv.appendChild(imgMovieDescription);
    descriptiondiv.appendChild(containerRate);
    descriptiondiv.appendChild(textMovieDescription);
    descriptiondiv.append(bottonContainer);
    description.append(descriptiondiv);
  };

  const componentMovie = (movie) => {
    const divMovie = document.createElement("div");
    const imgMovie = document.createElement("div");
    const h2Movie = document.createElement("h2");
    const h3Movie = document.createElement("h3");

    const movieImageDescription = `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`;
    const movieRateDescription = movie.vote_average;
    const movieDescription = movie.overview;
    const movieVoteCount = movie.vote_count;

    imgMovie.id = "imgmovie";
    divMovie.id = "divmovie";
    h3Movie.textContent = movie.release_date;
    imgMovie.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;
    h2Movie.textContent = movie.title || movie.name;

    divMovie.appendChild(imgMovie);
    divMovie.appendChild(h2Movie);
    divMovie.appendChild(h3Movie);

    divMovie.addEventListener("click", () => {
      containerDescription.classList.add("show");

      createDescription(
        movieRateDescription,
        movieVoteCount,
        movieDescription,
        movieImageDescription
      );
    });

    outDescription.addEventListener("click", () => {
      containerDescription.classList.remove("show");

      const divsAEliminar = description.querySelectorAll("div");
      divsAEliminar.forEach((div) => div.remove());
    });

    return divMovie;
  };

  const renderSearchMovies = async (word) => {
    const API_URL = `${BASE_URL}search/movie?query=${word}&page=1&include_adult=false&api_key=${APIKEY}`;
    const moviesData = await fetchData(API_URL);
    if (moviesData && moviesData.results) {
      const moviesArray = moviesData.results;
      moviesArray.forEach((movie) => {
        section.append(componentMovie(movie));
      });
    } else {
      console.log("No se pudieron obtener datos de peliculas");
    }
  };

  const renderMovies = async (page) => {
    const API_URL = `${BASE_URL}discover/${content}?api_key=${APIKEY}&language=es-ES&page=${page}&with_genres=${categorie}`;
    const moviesData = await fetchData(API_URL);
    if (moviesData && moviesData.results) {
      const moviesArray = moviesData.results;
      moviesArray.forEach((movie) => {
        section.append(componentMovie(movie));
      });
    } else {
      console.log("No se pudieron obtener datos de peliculas");
    }
  };

  const main = () => {
    renderMovies(1);
  };

  main();
});
