import NiceSelect from "nice-select2";
import { APIKEY } from "./secret";



document.addEventListener("DOMContentLoaded", () => {
  new NiceSelect(document.getElementById("a-select"));
  new NiceSelect(document.getElementById("categorie_select"));
});

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_URL = `${BASE_URL}discover/movie?api_key=${APIKEY}&language=es-ES`;

const section = document.querySelector("section");

const fetchData = async (api) => {
  try {
    const res = await fetch(api);
    const data = await res.json();
    console.log(data.results);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const componentMovie = (movie) => {
  const divMovie = document.createElement('div')  
  const imgMovie = document.createElement('div');
  const h2Movie = document.createElement('h2');

  imgMovie.id = "imgmovie"

  divMovie.id = "divmovie"

  imgMovie.style.backgroundImage = `url(https://image.tmdb.org/t/p/w500${movie.backdrop_path})`
  imgMovie.style.backgroundSize = 'cover'; // Ajusta el tamaño de la imagen
  imgMovie.style.backgroundPosition = 'center'; // Centra la imagen
  imgMovie.style.backgroundRepeat = 'no-repeat'; // Evita la repetición de la imagen


  h2Movie.textContent = movie.title;

  divMovie.appendChild(imgMovie);
  divMovie.appendChild(h2Movie);


  return divMovie


};

const renderMovies = async () => {
  const moviesData = await fetchData(API_URL);
  if(moviesData && moviesData.results){
      const moviesArray = moviesData.results;

      moviesArray.forEach((movie) => {
        section.append(componentMovie(movie))
        
      });
  } else {
      console.log("No se pudieron obtener datos de peliculas");
  }

};

renderMovies();







