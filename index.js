const autocompleteConfig = {
    renderOption: (movie) => {
        const imgSrc = movie.Poster === 'N/A' ? '': movie.Poster;
        return `
        <img src="${imgSrc} "/>
                ${movie.Title} (${movie.Year})
                `;
        },
        inputValue(movie){
            return movie.Title;
        },
        async fetchData(searchTerm){
            const response = await axios.get('http://www.omdbapi.com/', {
                params: {
                    apikey: 'f64e2985',
                    s: searchTerm
                }
            });
        
            if (response.data.Error) {
                return[];
            }
           return response.data.Search;
        }
};
        
createAutoComplete({
    ...autocompleteConfig,
root: document.querySelector('#left-autocomplete'),
onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#left-summary'));
}
});

createAutoComplete({
    ...autocompleteConfig,
root: document.querySelector('#right-autocomplete'),
onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onMovieSelect(movie, document.querySelector('#right-summary'));
},
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement,side) => {
    const response =  await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'f64e2985',
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemple(response.data);
if (side === 'left') {
    leftMovie = response.data;
    }

    else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index)=> {
     const rightStat = rightSideStats[index];

     const leftSideValue = parseInt(leftStat.dataset.value);
     const rightSideValue = parseInt(rightStat.dataset.value);

     if (rightSideValue > leftSideValue) {
        leftStat.classList.remove('is-primary');
        leftStat.classList.add('is-warning');

     } else {
        rightStat.classList.remove('is-primary');
        rightStat.classList.add('is-warning');
     }
    });
};

const movieTemple = movieDetail => {

    const dollars = parseInt
    (movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
   const Metascore = parseInt(movieDetail.Metascore);
   const imdbRating = parseFloat(movieDetail.imdbRating);
   const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g,''));
   let count = 0;
   const Awards = movieDetail.Awards.split(' ').reduce ((prev, word) => {
    const value = parseInt(word);
    if (isNaN(value)){
        return prev;
    } else{
        count = count + value;
    }
   }, 0);
   

    return `
    <article class="media">
    <figure class ="media-left">
    <p class = "image">
     <img src="${movieDetail.Poster}" />
     </p>
     </figure>
     <div class ="media-content">
     <div class = "content">
     <h1>${movieDetail.Title}</h1>
     <h4>${movieDetail.Genre}</h4>
     <p>${movieDetail.Plot}</p>
     </div>
     <div/>
    </article>
    <article data-value${Awards} class="notification is-primary">
    <p class="title">${movieDetail.Awards}</p>
    <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>
    <article data-value=${Metascore} class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
    <p class="title">${movieDetail.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
    <p class="title">${movieDetail.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
    </article>
    `;
}