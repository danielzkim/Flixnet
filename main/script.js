const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

let popularMovies = null;


// returns the top 7 most trending movies as a list
async function getTopTrendingMovies() {
    try {
        const response = await fetch(`${baseUrl}/trending/movie/day?api_key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const topMovies = data.results.slice(0, 13); // Get the top 6 trending movies
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


// Gets all the popular movies
// Function to generate HTML for the movie card with fetched data for the 2nd to 7th most popular movies
async function generateMovieCardHTML(movie) {

    const movieId = movie.id;
    const moviePosterUrl = movie.poster_path;
    const movieTitle = movie.title;
    const releaseDate = movie.release_date;
    const movieRating = movie.vote_average;

    // Generate HTML for a single movie card
    const movieCardHTML = `
            <button class="movie-card  select-movie" data-movie-id="${movieId}">
                <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
                <div class="movie-title">${movieTitle}</div>
                <p class="movie-info">
                    <span class="director">${movieRating}</span><br />
                    <span class="release-date">${releaseDate}</span>
                </p>
            </button>
    `;
    return movieCardHTML;
}

// Function to display the 2nd to 7th most popular movies with individual links
async function displayPopularMovies() {
    const popularMoviesContainer = document.getElementById('popular-movies-container');

    // Loop to generate and append HTML for each movie card
    for (let i = 1; i <= popularMovies.length - 1; i++) {
        const movieCardHTML = await generateMovieCardHTML(popularMovies[i]);
        if (movieCardHTML !== '') {
            popularMoviesContainer.innerHTML += movieCardHTML;
        }
    }
}

// Call the function to display the 2nd to 7th most popular movies with individual links


// Function to generate HTML for the Movie of the Day section with fetched data
async function generateMovieOfTheDayHTML() {
    if (popularMovies.length > 0) {
        const mostPopularMovie =  popularMovies[0]; // Assuming the first movie in the list is the most popular
        
        const moviePosterUrl = mostPopularMovie.poster_path;
        const movieTitle = mostPopularMovie.title;
        const releaseDate = mostPopularMovie.release_date;
        const movieRating = mostPopularMovie.vote_average;
        const movieId = mostPopularMovie.id;

        // Generate HTML
        const movieOfTheDayHTML = `
                <button class="movie-of-the-day select-movie" data-movie-id="${movieId}">
                    <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
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

async function init_homePage() {
    popularMovies = await getTopTrendingMovies();
    await displayPopularMovies();
    await displayMovieOfTheDay();
    attachEventListeners();
}

function attachEventListeners() {
    const movieCards = document.querySelectorAll('.select-movie');
    movieCards.forEach(card => {
        card.addEventListener('click', () => {
            const movieId = card.getAttribute('data-movie-id');
            handleMovieSelection(movieId);
        });
    });
}

init_homePage();