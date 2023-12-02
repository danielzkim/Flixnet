const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

let similarMovies = null;

// get movie info from ID
async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        const data = await response.json();

        const posterPath = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
        const title = data.title;
        const description = data.overview;
        const rating = data.vote_average;
        const releaseDate = data.release_date;
        const castResponse = await getMovieCast(movieId);
        const cast = convertActorsToString(castResponse);

        return { posterPath, title, description, rating, releaseDate, cast };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
}

async function getMovieCast(movieId) {
    try {
        let response = await fetch(`${baseUrl}/movie/${movieId}/credits?api_key=${apiKey}`);
        let data = await response.json();
        const cast = data.cast.map(actor => actor.name);
        return cast;
    } catch (error) {
        console.error('Error fetching cast:', error);
        return [];
    }
}

// Function to convert an array of actors to a comma-separated string
function convertActorsToString(actorsArray) {
    return actorsArray.join(', ');
}

// returns an array of similar movies to given id
async function getSimilarMovies(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const similarMovies = data.results.slice(0, 12);
            return similarMovies;
        } else {
            console.log('No similar movies found for the given movie ID.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching similar movies:', error);
        return [];
    }
}

// Function to generate HTML for a single movie card
async function generateSimilarMovieCardHTML(movie) {
    const moviePosterUrl = movie.poster_path;
    const movieTitle = movie.title;
    const releaseDate = movie.release_date;
    const movieRating = movie.vote_average;

    // Generate HTML for a single movie card
    const movieCardHTML = `
        <a href="/movie/index.html" style="text-decoration:none">
            <button class="movie-card" id="select-movie">
                <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
                <div class="movie-title">${movieTitle}</div>
                <p class="movie-info">
                    <span class="director">${movieRating}</span><br />
                    <span class="release-date">${releaseDate}</span>
                </p>
            </button>
        </a>
    `;
    return movieCardHTML;
}

// Function to display similar movies for a given movie ID
async function displaySimilarMovies(movieId) {
    const similarMoviesContainer = document.getElementById('related-movie-cards');

    try {
        const similarMovies = await getSimilarMovies(movieId);
        for (let i = 0; i < similarMovies.length; i++) {
            const movieCardHTML = await generateSimilarMovieCardHTML(similarMovies[i]);
            if (movieCardHTML !== '') {
                similarMoviesContainer.innerHTML += movieCardHTML;
            }
        }
    } catch (error) {
        console.error('Error fetching similar movies:', error);
    }
}


async function generateSelectedMovie() {
        const movie = await getMovieDetails(movieId);

        const moviePosterUrl = movie.posterPath;
        const movieTitle = movie.title;
        const releaseDate = movie.releaseDate;
        const movieRating = movie.rating;
        const movieDescription = movie.description;
        const movieCast = movie.cast;

        // Generate HTML
        const movieOfTheDayHTML = `
        <button class="movie" id="select-movie">
            <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
            <div class="movie-info">
                <div id="movie-title">${movieTitle}</div>
                <p>
                    <span class="director">${movieRating}<br /></span>
                   <span class="release-date">${releaseDate}</span>
                </p>
                <p class="description">
                   ${movieDescription}
                </p>
                <div class="cast">Cast:</div>
                <p id="cast">
                    ${movieCast}
                </p>
            </div>
        </button>
        `;
        return movieOfTheDayHTML;
}
          
async function displaySelectedMovie() {
    const selectedMovie = document.getElementById('selected-movie-container');
    const selectedMovieHTML = await generateSelectedMovie();
    selectedMovie.innerHTML = selectedMovieHTML;
}

async function movieInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('query'); // get id from url
    displaySelectedMovie();
    displaySimilarMovies();
}

movieInit();