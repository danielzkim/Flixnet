/*  API Key: 322ac30eac281d894f170e64aabc7faf

    Searching movie: 'https://api.themoviedb.org/3/search/movie?query={movie-name}include_adult=false&language=en-US&page=1'
    {movie-name} should be replaced with key words seperated by {%20}
    - .id

    Popular movies: 'https://api.themoviedb.org/3/trending/movie/day?language=en-US'
    - .id

    Similar movies: 'https://api.themoviedb.org/3/movie/{movie_id}/similar?language=en-US&page=1'
    {movie_id} should be replaced with the movie_id
    - .id

    Movie from ID: 'https://api.themoviedb.org/3/search/movie/{movie_id}
    {movie_id} should be replaced with the movie_id
    - .poster_path (gets poster img)
    - .title (gets movie title)
    - .overview (gets description of the movie)
    - .vote_average (gets rating of the movie)
    
    Movie cast: 'https://api.themoviedb.org/3/search/movie/{movie_id}/credits'
    {movie_id} should be replaced with the movie_id
    - .cast (gets you movie cast)

*/

const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

https://api.themoviedb.org/3/movie/414906?api_key=322ac30eac281d894f170e64aabc7faf

// Might need to add /search/ to all these fetchs
// Function to get poster for a given movie ID
async function getMoviePoster(movieId) {
    try {
        let response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        let data = await response.json();
        let posterPath = data.poster_path;
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    } catch (error) {
        console.error('Error fetching poster:', error);
        return null;
    }
}

// Function to get title for a given movie ID
async function getMovieTitle(movieId) {
    try {
        let response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        let data = await response.json();
        return data.title;
    } catch (error) {
        console.error('Error fetching title:', error);
        return null;
    }
}

// Function to get description for a given movie ID
async function getMovieDescription(movieId) {
    try {
        let response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        let data = await response.json();
        return data.overview;
    } catch (error) {
        console.error('Error fetching description:', error);
        return null;
    }
}

// Function to get rating for a given movie ID
async function getMovieRating(movieId) {
    try {
        let response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        let data = await response.json();
        return data.vote_average;
    } catch (error) {
        console.error('Error fetching rating:', error);
        return null;
    }
}

// Function to get cast for a given movie ID
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

function convertActorsToString(actorsArray) {
    return actorsArray.join(', ');
}

// get release date from given id
async function getMovieReleaseDate(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}`);
        const data = await response.json();
        
        if (data.release_date) {
            return data.release_date;
        } else {
            console.log('Release date not found for the given movie ID.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching release date:', error);
        return null;
    }
}

// returns list of movie ids from keywords
async function searchMoviesByKeywords(keywords) {
    try {
        const encodedKeywords = encodeURIComponent(keywords); // Encode spaces as %20
        const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${encodedKeywords}&include_adult=false&language=en-US&page=1`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const movieIds = data.results.map(movie => movie.id);
            return movieIds;
        } else {
            console.log('No movies found for the given keywords.');
            return [];
        }
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
}

// returns the top 7 most trending movies as a list
async function getTopTrendingMovies() {
    try {
        const response = await fetch(`${baseUrl}/trending/movie/day?api_key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const topMovies = data.results.slice(0, 7); // Get the top 6 trending movies
            return topMovies;
        } else {
            console.log('No trending movies found for today.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

// returns an array of similar movies to given id
async function getSimilarMovies(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}/similar?api_key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const similarMovies = data.results;
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

search = document.getElementById("search-icon");
query = document.getElementById("search-text");
// popularMovieCards = document.querySelectorAll('.movie-card')
movieOfTheDay = document.getElementById("movie-of-the-day")

// const popularMovies = getTopTrendingMovies()



// Update Popular Movies section with top 6 trending movies
async function updatePopularMovies() {
    const popularMovies = await getTopTrendingMovies();
    if (popularMovies.length > 0) {
        const popularMovieCards = document.querySelectorAll('.movie-card');
        
        for (let i = 0; i < popularMovieCards.length && i < popularMovies.length; i++) {
            const currentMovie = popularMovies[i + 1];

            const movieTitleElement = popularMovieCards[i].querySelector('.movie-title');
            movieTitleElement.textContent = currentMovie.title;

            const releaseDateElement = popularMovieCards[i].querySelector('.release-date');
            const releaseDate = await getMovieReleaseDate(currentMovie.id);
            releaseDateElement.textContent = releaseDate;

            const moviePosterUrl = await getMoviePoster(currentMovie.id);
            const moviePosterElement = popularMovieCards[i].querySelector('.movie-img');
            moviePosterElement.src = moviePosterUrl;
        }
    }
}

updatePopularMovies();


// Function to update Movie of the Day section with the most popular movie
async function updateMovieOfTheDay() {
    const popularMovies = await getTopTrendingMovies();
    if (popularMovies.length > 0) {
        const mostPopularMovie = popularMovies[0]; // Assuming the first movie in the list is the most popular
        
        const movieTitleElement = document.getElementById('movie-title');
        movieTitleElement.innerHTML = mostPopularMovie.title;

        const releaseDateElement = document.querySelector('.release-date');
        const releaseDate = await getMovieReleaseDate(mostPopularMovie.id);
        releaseDateElement.innerHTML = releaseDate;

        const moviePosterUrl = await getMoviePoster(mostPopularMovie.id);
        const moviePosterElement = document.querySelector('.movie-img');
        moviePosterElement.src = moviePosterUrl;

        const movieRatingElement = document.querySelector('.director'); // Using director field to display rating
        const movieRating = await getMovieRating(mostPopularMovie.id);
        movieRatingElement.innerHTML = `Rating: ${movieRating}`;
    }
}

updateMovieOfTheDay();
/* 
            Movie card:

            ? = getTopTrendingMovies()[1-6] (for popular movies)
            ? = getSimilarMovies(id)[0-12] (for related movies)
            ? = searchMoviesByKeywords(searchedWords)[0-18]

            <button class="movie-card">
              <img class="movie-img" src=getMoviePoster(?)>
              <div class="movie-title">getMovieTitle(?)</div>
              <p class="movie-info">
                <span class="release-date">getMovieReleaseDate(?)</span>
              </p>
            </button>

            Movie of the day:

            ? = getTopTrendingMovies()[0]

            <button class="movie-of-the-day">
                <img class="movie-img" src=getMoviePoster(?)>
                <div class="movie-info">
                    <div id="movie-of-the-day">Movie of the Day:</div>
                    <div id="movie-title">getMovieTitle(?)</div>
                    <p>
                        <span class="release-date">getMovieReleaseDate(?)</span>
                    </p>
                </div>
            </button>

            Selected movie:

            ? = id of selected movie

            <button class="movie">
                <img class="movie-img" src=getMoviePoster(?)>
                <div class="movie-info">
                    <div id="movie-title">getMovieTitle(?)</div>
                    <p>
                        <span class="release-date">getMovieReleaseDate(?)</span>
                    </p>
                    <p class="description">
                        getMovieDescription(?)
                    </p>
                    <div class="cast">Cast:</div>
                    <p id="cast">
                        convertActorsToString(getMovieCast(?))
                    </p>
                </div>
            </button>

*/