document.addEventListener("DOMContentLoaded", function () {
    const movieListContainer = document.getElementById("movieList");
    const addMovieBtn = document.getElementById("addMovieBtn");

    addMovieBtn.addEventListener("click", function () {
        const movieTitle = prompt("Digite o título do filme:");
        if (movieTitle) {
            searchMovies(movieTitle);
        }
    });

    function addMovieToList(movie, source, streamingService) {
        const movieItem = document.createElement("div");
        movieItem.classList.add("movie-item");

        if (movie.poster_path) {
            const img = document.createElement("img");
            img.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
            img.alt = `${movie.title} Poster`;
            movieItem.appendChild(img);
        }

        const movieInfo = document.createElement("div");
        movieInfo.classList.add("movie-info");
        movieInfo.innerHTML = `
            <p><strong>${movie.title}</strong> (${movie.release_date}) - Source: ${source}</p>
            <p><strong>Descrição:</strong> ${movie.overview}</p>
            <p><strong>Diretor:</strong> ${getDirectors(movie.credits)}</p>
            <p><strong>Atores:</strong> ${getActors(movie.credits)}</p>
            <p><strong>Onde Assistir:</strong> ${streamingService}</p>
        `;
        movieItem.appendChild(movieInfo);

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remover";
        removeBtn.addEventListener("click", function () {
            removeMovie(movieItem);
        });
        movieItem.appendChild(removeBtn);

        movieListContainer.appendChild(movieItem);
    }

    function removeMovie(movieItem) {
        movieListContainer.removeChild(movieItem);
    }

    function searchMovies(title) {
        const tmdbApiKey = "971dac0dc891a1747321ceeee8a2c768";
        const tmdbApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}&append_to_response=credits`;

        const omdbApiKey = "bc82d451";
        const omdbApiUrl = `https://www.omdbapi.com/?apikey=${omdbApiKey}&t=${encodeURIComponent(title)}`;

        fetch(tmdbApiUrl)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const tmdbResult = data.results[0];

                    fetch(omdbApiUrl)
                        .then(response => response.json())
                        .then(omdbData => {
                            if (omdbData.Title && omdbData.imdbRating >= tmdbResult.vote_average) {
                                addMovieToList(omdbData, "OMDB", omdbData.WhereToWatch);
                            } else {
                                addMovieToList(tmdbResult, "TMDb", "TMDb");
                            }
                        })
                        .catch(error => {
                            console.error("Erro na solicitação à API OMDB:", error);
                            alert("Erro ao buscar filme na OMDB. Por favor, tente novamente mais tarde.");
                        });
                } else {
                    fetch(omdbApiUrl)
                        .then(response => response.json())
                        .then(data => {
                            if (data.Title) {
                                addMovieToList(data, "OMDB", data.WhereToWatch);
                            } else {
                                alert("Filme não encontrado em ambas as APIs.");
                            }
                        })
                        .catch(error => {
                            console.error("Erro na solicitação à API OMDB:", error);
                            alert("Erro ao buscar filme na OMDB. Por favor, tente novamente mais tarde.");
                        });
                }
            })
            .catch(error => {
                console.error("Erro na solicitação à API TMDb:", error);
                alert("Erro ao buscar filme no TMDb. Por favor, tente novamente mais tarde.");
            });
    }

    function getDirectors(credits) {
        const directors = credits?.crew?.filter(person => person.job === 'Director');
        return directors ? directors.map(director => director.name).join(', ') : 'N/A';
    }

    function getActors(credits) {
        const actors = credits?.cast?.slice(0, 5);
        return actors ? actors.map(actor => actor.name).join(', ') : 'N/A';
    }
});
