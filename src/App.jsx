import { useState } from 'react'
import loader from './assets/loading.gif'
import axios from 'axios'
import './App.css'

function App() {
  const [banList, setBanList] = useState({ "production_countries": [], "production_companies": [], "release_date": [], "original_language": [], "genres": [] })
  const [movie, setMovie] = useState({ title: "", original_language: "en", original_title: "", release_date: "" })
  const [Image, setImage] = useState("https://ih1.redbubble.net/image.1893341687.8294/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg")
  const [genre, setGenre] = useState([])
  const [loading, setLoading] = useState(true)
  const [countries, setCountries] = useState([])
  const [prod, setProd] = useState([])
  const [recent, setRecent] = useState([{ title: "", url: "" }])



  const languageNames = new Intl.DisplayNames(['en'], {
    type: 'language'
  });


  const url = 'https://api.themoviedb.org/3/movie/';

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: import.meta.env.VITE_AUTH,
    }
  };

  const getData = (randomnumber) => {
    axios.get(url + randomnumber, options).then((r) => {
      let statuscode = r.status;

      setLoading(false)
      if (r.data.adult) {
        findMovie();
        return;
      }
      if (!filt(r.data)) {
        findMovie()
        return;
      }
      setMovie(r.data)

      if (r.data.poster_path) {
        setImage("https://image.tmdb.org/t/p/original/" + r.data.poster_path)
        setRecent([...recent, { title: r.data.title, url: "https://image.tmdb.org/t/p/original/" + r.data.poster_path }])
      } else {
        setImage("https://ih1.redbubble.net/image.1893341687.8294/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg")
        setRecent([...recent, { title: r.data.title, url: "https://ih1.redbubble.net/image.1893341687.8294/poster,504x498,f8f8f8-pad,600x600,f8f8f8.jpg" }])

      }
      

      if (r.data.genres.length > 0) {
        setGenre(r.data.genres)


      } else {
        setGenre([])
      }
      if (r.data.production_countries.length > 0) {
        setCountries(r.data.production_countries)

      } else {
        setCountries([])
      }
      if (r.data.production_companies.length > 0) {
        setProd(r.data.production_companies)

      } else {
        setProd([])
      }
      
    }).catch((e) => {
      findMovie()
    })

  }

  const findMovie = () => {
    setLoading(true)
    var randomnumber = Math.floor(Math.random() * (1188179 - 1 + 1)) + 1;
    getData(randomnumber)


  }
  const ban = (kind, id, name) => {
    let k = { ...banList }
    Object.assign(k[kind], [...k[kind], { "id": id, "name": name }])
    setBanList(k)
  }
  const filt = (movie) => {
    if (banList.genres.some(e => movie.genres.some(l => e.id === l.id))) {
      return false;
    }

    if (banList.original_language.some(e => movie.original_language == e.id)) {
      return false;
    }

    if (banList.production_countries.some(e => movie.production_countries.some(l => e.id === l.iso_3166_1))) {
      return false;
    }
    console.log(banList.production_companies, movie.production_companies)

    if (banList.production_companies.some(e => movie.production_companies.some(l => e.id === l.id))) {
      return false;
    }
    if (banList.release_date.some(e => e.id == movie.release_date.substr(0, 4))) {
      return false;
    }

    return true;
  }





  return (
    <>
      <div>
        <div className="container">
          <h1 className="title">Movie Suggester</h1>
          <h3 className="subtitle">Find which movie to watch Next</h3>

          {loading ? <div className="loading">
            <img src={loader} alt="loading" />
          </div> :
            <div className="afterLoad">
              <img height={100} width={100} src={Image} />
              <h2>{movie.original_title}</h2>
              <h2>{movie.title}</h2>
              <p className="details">{movie.overview}</p>


              <button className="attribute" onClick={() => { ban("original_language", movie.original_language, languageNames.of(movie.original_language)) }}>{languageNames.of(movie.original_language)}</button>
              {movie.release_date ? <button className="attribute" onClick={() => { ban("release_date", movie.release_date.substr(0, 4), movie.release_date.substr(0, 4)) }}>{movie.release_date.substr(0, 4)}</button> : ""}
              {countries.map(e => <button key={e.name} onClick={() => { ban("production_countries", e.iso_3166_1, e.name) }}>{e.name}</button>)}
              {genre.map(e => <button key={e.name} onClick={() => { ban("genres", e.id, e.name) }}>{e.name}</button>)}
              {prod.map(e => <button key={e.name} onClick={() => { ban("production_companies", e.id, e.name) }}>{e.name}</button>)}
            </div>}
            <br />
          <button className="discover" onClick={findMovie}>🔀 Discover!</button>

        </div>
        <div className='banlist-container'>
          <h1>Ban list</h1>
          <div className="banList">
            <h3>Genre</h3>
            <ol>
              {banList.genres.map(e => <li key={e.id}>{e.name}</li>)}
            </ol>
          </div>
          <div className="banList">
            <h3>Year</h3>
            <ol>
              {banList.release_date.map(e => <li key={e.id}>{e.name}</li>)}
            </ol>
          </div>
          <div className="banList">
            <h3>Language</h3>
            <ol>
              {banList.original_language.map(e => <li key={e.id}>{e.name}</li>)}
            </ol>
          </div>
          <div className="banList">
            <h3>Countries</h3>
            <ol>
              {banList.production_countries.map(e => <li key={e.id}>{e.name}</li>)}
            </ol>
          </div>
          <div className="banList">
            <h3>Production Companies</h3>
            <ol>
              {banList.production_companies.map(e => <li key={e.id}>{e.name}</li>)}
            </ol>
          </div>

        </div>
        <div className="recentlySeen">
          <h1>History</h1>
          {recent.map(e => <div key={e.title} className='hist'>
            <img src={e.url} height={40} className='recImg' width={40} />
            <p>{e.title}</p>
            <hr /></div>
          )}

        </div>
      </div>
    </>
  )
}

export default App
