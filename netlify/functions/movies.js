// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  
  // define the query string parameters
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // provide error message if users don't input all query infomation required
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please enter a year and a movie genre!` // a string of data
    }
  }

  // define the return object
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // loop through all movies
    for (let i=0; i < moviesFromCsv.length; i++) {
      // store each listing in memory
      let movie = moviesFromCsv[i]

      // Create a new movie object containing the pertinent fields
      let movieObject = {
        primaryTitle: movie.primaryTitle,
        year: movie.startYear,
        genre: movie.genres
      }

      // Pick movies according to the query and inore any results with no genre or movies with no runtime
      if (movie.genres.includes(genre) && movie.startYear == year && movie.runtimeMinutes !== "\\N") {
        // add the movie to the Array of movies to return
        returnValue.movies.push(movieObject)
        returnValue.numResults = returnValue.numResults +1
      }
    }

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}

