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


/* 
            Movie card:

            <button class="movie-card">
              <img class="movie-img" src=getMoviePoster(?)>
              <div class="movie-title">getMovieTitle(?)</div>
              <p class="movie-info">
                <span class="release-date">getMovieReleaseDate(?)</span>
              </p>
            </button>

            Movie of the day:

            <button class="movie-of-the-day">
                <img class="movie-img" src="getMoviePoster(?)">
                <div class="movie-info">
                    <div id="movie-of-the-day">Movie of the Day:</div>
                    <div id="movie-title">getMovieTitle(?)</div>
                    <p>
                        <span class="director">Director Name<br /></span> 
                        <span class="release-date">Release Date</span>
                    </p>
                </div>
            </button>