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

// Gets all the popular movies
// Function to generate HTML for the movie card with fetched data for the 2nd to 7th most popular movies
async function generateMovieCardHTML(movieIndex) {
    const popularMovies = await getTopTrendingMovies();
    if (popularMovies.length >= movieIndex) {
        const movie = popularMovies[movieIndex - 1]; // -1 to match array index

        const moviePosterUrl = await getMoviePoster(movie.id);
        const movieTitle = movie.title;
        const releaseDate = await getMovieReleaseDate(movie.id);
        const movieRating = await getMovieRating(movie.id);

        // Generate HTML for a single movie card
        const movieCardHTML = `
            <a href="/movie/index.html" style="text-decoration:none">
                <button class="movie-card">
                    <img class="movie-img" src="${moviePosterUrl}">
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
    return '';
}

// Function to display the 2nd to 7th most popular movies with individual links
async function displayPopularMovies() {
    const popularMoviesContainer = document.getElementById('popular-movies-container');

    // Loop to generate and append HTML for each movie card
    for (let i = 2; i <= 7; i++) {
        const movieCardHTML = await generateMovieCardHTML(i);
        if (movieCardHTML !== '') {
            popularMoviesContainer.innerHTML += movieCardHTML;
        }
    }
}

// Call the function to display the 2nd to 7th most popular movies with individual links
displayPopularMovies();


// Function to update Movie of the Day section with the most popular movie
// Function to generate HTML for the Movie of the Day section with fetched data
async function generateMovieOfTheDayHTML() {
    const popularMovies = await getTopTrendingMovies();
    if (popularMovies.length > 0) {
        const mostPopularMovie = popularMovies[0]; // Assuming the first movie in the list is the most popular
        
        const moviePosterUrl = await getMoviePoster(mostPopularMovie.id);
        const movieTitle = mostPopularMovie.title;
        const releaseDate = await getMovieReleaseDate(mostPopularMovie.id);
        const movieRating = await getMovieRating(mostPopularMovie.id);

        // Generate HTML
        const movieOfTheDayHTML = `
                <button class="movie-of-the-day">
                    <img class="movie-img" src="${moviePosterUrl}">
                    <div class="movie-info">
                        <div id="movie-of-the-day">Movie of the Day:</div>
                        <div id="movie-title">${movieTitle}</div>
                        <p>
                            <span class="director">${movieRating}</span><br />
                            <span class="release-date">${releaseDate}</span>
                        </p>
                    </div>
                </button>
        `;
        return movieOfTheDayHTML;
    }
    return '';
}

// Get the generated HTML and append it to a specific element on your page
async function displayMovieOfTheDay() {
    const movieOfTheDayContainer = document.getElementById('movie-of-the-day-container');
    const movieOfTheDayHTML = await generateMovieOfTheDayHTML();
    movieOfTheDayContainer.innerHTML = movieOfTheDayHTML;
}

// Call the function to display Movie of the Day
displayMovieOfTheDay();



// everything for search
search = document.getElementById("search-icon");
query = document.getElementById("search-text");

// Function to generate movie card HTML from movie IDs
async function generateMovieCardsFromIDs(movieIds) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = ''; // Clear previous search results

    // Loop through movie IDs and generate HTML for each movie card
    for (const movieId of movieIds) {
        const moviePosterUrl = await getMoviePoster(movieId);
        const movieTitle = await getMovieTitle(movieId);
        const releaseDate = await getMovieReleaseDate(movieId);
        const movieCardHTML = `
          <a href="/movie/index.html" style="text-decoration:none">
            <button class="movie-card">
                <img class="movie-img" src="${moviePosterUrl}">
                <div class="movie-title">${movieTitle}</div>
                <p class="movie-info">
                    <span class="director">Director Name<br /></span> 
                    <span class="release-date">${releaseDate}</span>
                </p>
            </button>
          </a>
        `;
        searchResultsContainer.innerHTML += movieCardHTML; // Append movie card to container
    }
}

// Event listener for search button click
document.getElementById('search-icon').addEventListener('click', async () => {
    const searchText = document.getElementById('search-text').value.trim();

    if (searchText !== '') {
        // Perform search using input text
        const movieIds = await searchMoviesByKeywords(searchText);
        await generateMovieCardsFromIDs(movieIds);
    } else {
        // Handle empty search text or provide a default behavior
    }
});

// woorks for the keypress enter
document.getElementById('search-text').addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
        const searchText = document.getElementById('search-text').value.trim();

        if (searchText !== '') {
            const movieIds = await searchMoviesByKeywords(searchText);
            await generateMovieCardsFromIDs(movieIds);
        } else {
            // Handle empty search text or provide a default behavior
        }
    }
});


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