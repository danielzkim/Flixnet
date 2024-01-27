const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

let popularMovies = null;


// returns the top 13 most trending movies as a list
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

// returns the top 13 movies from a specific genre
async function getMoviesFromGenre(genreId = 28) {
    try {
        const response = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreId}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const moviesFromGenre = data.results.slice(0, 13); // Get the top 6 trending movies
            return moviesFromGenre;
        } else {
            console.log('No movies from this genre found for today.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching genre movies:', error);
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
                    <span class="director">Rating: ${movieRating} / 10</span><br />
                    <span class="release-date">Release Date: ${formatDateToEnglish(releaseDate)}</span>
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

// Function to display the 2nd to 7th most popular movies with individual links
async function displayGenreMovies() {
    const genreMoviesContainer = document.getElementById('genre-movies-container');

    // Loop to generate and append HTML for each movie card
    for (let i = 1; i <= genre.length - 1; i++) {
        const movieCardHTML = await generateMovieCardHTML(genre[i]);
        if (movieCardHTML !== '') {
            genreMoviesContainer.innerHTML += movieCardHTML;
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
                            <span class="director">Rating: ${movieRating} / 10</span><br />
                            <span class="release-date">Release Date: ${formatDateToEnglish(releaseDate)}</span>
                        </p>
                    </div>
                </button>
        `;
        return movieOfTheDayHTML;
    }
    return '';
}

function formatDateToEnglish(inputDate) {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
  
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1], 10) - 1];
    const day = parseInt(dateParts[2], 10);
  
    let daySuffix = 'th';
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = 'st';
    } else if (day === 2 || day === 22) {
      daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
      daySuffix = 'rd';
    }
    const formattedDate = `${month} ${day}${daySuffix}, ${year}`;
    return formattedDate;
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
    genre = await getMoviesFromGenre();
    await displayGenreMovies();
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