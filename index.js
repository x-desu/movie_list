    const inputEl = document.getElementById('search')
    const searchBtn = document.getElementById('search-btn')
    const watchlistEl = document.getElementById('watchlist-el')
    const spinnerEl = document.getElementById('spinner'); // Get the spinner element

    //&apikey=eb67946d
    let endpoint = ''
    let savedMovies = []
    let movieObj =[]


 
    const api = async (endpoint) => {
        spinnerEl.style.display = 'block';
    const response = await fetch(`https://www.omdbapi.com/?apikey=eb67946d&${endpoint}`)
    const data = await response.json()
    spinnerEl.style.display = 'none';
    return data
    }
    
    
    const handleSearch = async() => {
        if(inputEl.value){
            endpoint = `s=${inputEl.value}`
        const data = await api(endpoint)
        renderHtml(data)
        }
    }

function removeMovie(e) {
  const movieId = e.target.getAttribute('data-watch');
  const savedMovies = JSON.parse(localStorage.getItem('movies'));
  const updatedMovies = savedMovies.filter(movie => movie.id !== movieId);
  localStorage.setItem('movies', JSON.stringify(updatedMovies));
  getSavedMovies();
}

    function watchList(e){
            for(let item of movieObj){
            if(e.target.dataset.watch == item.id){
            if (!savedMovies.includes(item)) {
                savedMovies.push(item);
            }
            }}
            localStorage.setItem('movies',JSON.stringify(savedMovies))
    }

    function getSavedMovies(){
        let feedHtml = ``
        if(localStorage.getItem('movies') != "[]"){
            const data = JSON.parse(localStorage.getItem('movies'))
            for(let movieDetail of data){
                feedHtml +=`<div class="movie">
                        <div class="poster">
                        <img src=${movieDetail.movie.Poster} alt=${movieDetail.Title}/>
                        </div>
                        <div class="movie-info">
                        <h1>${movieDetail.movie.Title}<span class="star">
                        <i class="fa-solid fa-star" style="color: #FEC654;"></i> 
                        ${(movieDetail.movie.imdbRating)}</span></h1>
                        <div class="extra">
                        <h4>${movieDetail.movie.Runtime}</h4>
                        <h4>${movieDetail.movie.Genre}</h4>
                        <div class="watch-list" data-watch="${movieDetail.id}">
                        <i class="fa-solid fa-circle-minus list" data-watch="${movieDetail.id}" ><span class="list" data-watch="${movieDetail.id}">Watchlist</span></i>
                        </div>
                        </div>
                        <p>${movieDetail.movie.Plot}</p>
                        </div>
                        </div>
                        <hr>
                        `
             }
             document.getElementById('main').innerHTML =  feedHtml;
             
             const watchListElements = document.getElementsByClassName('watch-list');
            for (let movie of watchListElements) {
            movie.addEventListener('click', removeMovie);
            }
            
        }else{
            document.getElementById('main').innerHTML =`<div class="placeholder">
                     <h4>Your wishlist is looking kinda empty...</h4>
                     </div>`;
        }
            
    }

   if (watchlistEl) {
  watchlistEl.addEventListener('click', (e) => {
    e.preventDefault();
    if(watchlistEl.textContent == 'My Watchlist'){
    watchlistEl.textContent = 'Search for movies';
    document.getElementById('title').children[0].textContent = 'My watchlist';
    getSavedMovies();
    }else{
    watchlistEl.textContent = 'My Watchlist';
    document.getElementById('title').children[0].textContent = 'Find your film';
    document.getElementById('main').innerHTML = `<div  class="placeholder">
                <img src="./images/placeholder.png"/>
                <h4>Start exploaring </h4>
            </div>`   
    }
    
  });
}

    if(searchBtn){
    searchBtn.addEventListener('click',handleSearch)
    }
    /* fetch('https://www.omdbapi.com/?apikey=eb67946d&s=batman')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error)); */
    async function renderHtml(data){
        let feedHtml = ``
        let movieDetail = ''
        
        for(let movie of data.Search){
            
            endpoint = `i=${movie.imdbID}`
            movieDetail = await api(endpoint)
            movieObj.push({
                id:movie.imdbID,
                movie:movieDetail
            })
            feedHtml += `<div class="movie">
                        <div class="poster">
                        <img src=${movieDetail.Poster} alt=${movieDetail.Title}/>
                        </div>
                        <div class="movie-info">
                        <h1>${movieDetail.Title}<span class="star">
                        <i class="fa-solid fa-star" style="color: #FEC654;"></i> 
                        ${(movieDetail.imdbRating)}</span></h1>
                        <div class="extra">
                        <h4>${movieDetail.Runtime}</h4>
                        <h4>${movieDetail.Genre}</h4>
                        <div class="watch-list" data-watch="${movie.imdbID}">
                        <i class="fa-solid fa-circle-plus list" data-watch="${movie.imdbID}" ><span class="list" data-watch="${movie.imdbID}">Watchlist</span></i>
                        </div>
                        </div>
                        <p>${movieDetail.Plot}</p>
                        </div>
                        </div>
                        <hr>
                        `
        } 
        document.getElementById('main').innerHTML = feedHtml;
        
        const watchListElements = document.getElementsByClassName('watch-list')
        for (let movie of watchListElements) {
            movie.addEventListener('click', watchList)
        }
    }