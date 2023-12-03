const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

let searchResults = null;

// returns list of movie ids from keywords
async function searchMoviesByKeywords(keywords) {
    try {
        const encodedKeywords = encodeURIComponent(keywords);
        console.log(encodedKeywords);
        const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${encodedKeywords}&include_adult=false&language=en-US&page=1`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const movieIds = data.results.slice(0, 18);
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

// Function to generate movie card HTML from movie IDs
async function generateMovieCardHTML(movie) {
    // searchResultsContainer.innerHTML = ''; // Clear previous search results

    const moviePosterUrl = movie.poster_path;
    const movieTitle = movie.title;
    const releaseDate = movie.release_date;
    const rating = movie.vote_average;
    const movieId = movie.id;

    const movieCardHTML = `
        <button class="movie-card select-movie" data-movie-id="${movieId}">
            <img class="movie-img" src="https://image.tmdb.org/t/p/w500${moviePosterUrl}">
            <div class="movie-title">${movieTitle}</div>
            <p class="movie-info">
                <span class="director">${rating}<br /></span> 
                <span class="release-date">${releaseDate}</span>
            </p>
        </button>
    `;

    return movieCardHTML;    
}

async function displaySearchResults() {
    const searchResultsContainer = document.getElementById('search-results');

    // Loop to generate and append HTML for each movie card
    for (let i = 0; i <= searchResults.length; i++) {
        const movieCardHTML = await generateMovieCardHTML(searchResults[i]);
        if (movieCardHTML !== '') {
            searchResultsContainer.innerHTML += movieCardHTML;
        }
    }
}

async function searchPageInit() {
    const urlParams = new URLSearchParams(window.location.search);
    // searchResults = searchMoviesByKeywords(urlParams.get('query'));

    const query = urlParams.get('query');

    if (query) {
        searchResults = await searchMoviesByKeywords(query);
        displaySearchResults();
    } else {
        console.error('No query found in URL');
    }
    //displaySearchResults();
}

searchPageInit();


