import NiceSelect from "nice-select2";
import { APIKEY } from "./secret";

document.addEventListener('DOMContentLoaded', function () {
    const selectElementnice = new NiceSelect(document.getElementById("a-select"));
    const selectElementnice2 = new NiceSelect(document.getElementById("categorie_select"));
});

const section = document.querySelector("section");
const selectElement = document.getElementById("a-select");
const selectCategory = document.getElementById("categorie_select")

let content = selectElement.value;

let categorie = selectCategory.value;


selectCategory.addEventListener("change",  function () {
  categorie = selectCategory.value;

  const divsAEliminar = section.querySelectorAll("div#divmovie");

  divsAEliminar.forEach((div) => {
      div.remove();
  });

  main();
});

selectElement.addEventListener("change",  function () {
    content = selectElement.value;
    const divsAEliminar = section.querySelectorAll("div#divmovie");

    divsAEliminar.forEach((div) => {
        div.remove();
    });

    main();
});

const BASE_URL = "https://api.themoviedb.org/3/";

const fetchData = async (api) => {
    try {
        const res = await fetch(api);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

const componentMovie = (movie) => {
    const divMovie = document.createElement("div");
    const imgMovie = document.createElement("div");
    const h2Movie = document.createElement("h2");

    imgMovie.id = "imgmovie";
    divMovie.id = "divmovie";

    imgMovie.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`;

    h2Movie.textContent = movie.title || movie.name;

    divMovie.appendChild(imgMovie);
    divMovie.appendChild(h2Movie);

    return divMovie;
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
