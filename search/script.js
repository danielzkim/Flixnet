const apiKey = '322ac30eac281d894f170e64aabc7faf';
const baseUrl = 'https://api.themoviedb.org/3';

let searchResults = null;

// returns list of movie ids from keywords
async function searchMoviesByKeywords(keywords) {
    try {
        const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${keywords}&include_adult=false&language=en-US&page=1`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const movieIds = ddata.results.slice(0, 17);
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
async function generateMovieCardsFromIDs(movie) {
    searchResultsContainer.innerHTML = ''; // Clear previous search results

    const moviePosterUrl = movie.poster_path;
    const movieTitle = movie.title;
    const releaseDate = movie.release_date;
    const rating = movie.vote_average;

    const movieCardHTML = `
        <a href="/movie/index.html" style="text-decoration:none">
        <button class="movie-card">
            <img class="movie-img" src="${moviePosterUrl}">
            <div class="movie-title">${movieTitle}</div>
            <p class="movie-info">
                <span class="director">${rating}<br /></span> 
                <span class="release-date">${releaseDate}</span>
            </p>
        </button>
        </a>
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
    searchResults = searchMoviesByKeywords(urlParams.get('query'));
    displaySearchResults();
}

searchPageInit();


// everything for search

async function search() {
    const searchText = document.getElementById('search-text').value.trim();

    if (searchText !== '') {
        // Constructing the URL with search query parameters
        const paramsString = `?query=${encodeURIComponent(searchText)}`;
        const newUrl = `http://127.0.0.1:5500/search/index.html${paramsString}`;

        // Redirect to the new URL
        window.location.href = newUrl;
    } else {
        // Handle empty search text or provide a default behavior
    }
}

// Event listener for search button click
document.getElementById('search-icon').addEventListener('click', search())

// works for the keypress enter
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