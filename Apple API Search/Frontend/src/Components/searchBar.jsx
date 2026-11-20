import { useState } from "react";
import axios from 'axios';
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function mediaObject(name, collectionName, artistName, releaseDate, image){
  this.name = name;
  this.collectionName = collectionName;
  this.artistName = artistName;
  this.releaseDate = releaseDate;
  this.image = image
}

fetch("http://localhost:8000/api/getToken",{
            method: "GET",
        })
        .then((response) => response.json())
        .then((data) =>{
          sessionStorage.setItem("LoginToken", data.token)
          console.log(sessionStorage.getItem("LoginToken"))
        })
        .catch((error) => {
            console.error("Could not Create Token", error)
        });





function Searchbar(){
    const [search, setSearch] = useState("")
    const [media, setMedia] = useState("")
    const [currentSearchResults, setCurrentSearchResults] = useState([])
    const [currentFavorites, setCurrentFavorites] = useState([])
    let allResults = [];
    let favoriteResults = []

    function handleChangeSearch(e){
        e.preventDefault();
        setSearch(e.target.value);
    }


    
    function handleChangeMedia(e){
         e.preventDefault();
        setMedia(e.target.value);
    }
    
    function handleSubmit(){
      let loginToken = sessionStorage.getItem("LoginToken")

        fetch("http://localhost:8000/api/Itunes",{
            method: "POST",
            headers: {
        "Authorization":  "Bearer " + loginToken,
        "Content-Type": "application/json",
         },
            body: JSON.stringify({Search: search, Media: media})
        })
        .then((response) => response.json())
        .then((data) =>{
          allResults = []

          console.log(data);
          data.results.map(item =>{ 
            if (item.trackCensoredName !== undefined){
            allResults.push(new mediaObject(item.trackCensoredName, item.collectionName, item.artistName, item.releaseDate, item.artworkUrl100))}})
          console.log(allResults)
          setCurrentSearchResults(allResults)
        })
        .catch((error) => {
            console.error("Could not search", error)
        });
    };


    function saveToFavorites(item){
      let latestFavorite = new mediaObject(item.name, item.collectionName, item.artistName, item.releaseDate, item.image)
      currentFavorites.map(item => {
        favoriteResults.push(item)
      })
      favoriteResults.push(latestFavorite)
      setCurrentFavorites(favoriteResults)
    }

    function deleteFromFavorites(item){
      let deletionItem = item

      currentFavorites.map(item => {
        favoriteResults.push(item)
      })

      favoriteResults.splice(favoriteResults.indexOf(item), 1)

      setCurrentFavorites(favoriteResults)
    }

    

    return(
        <>
        <h1>
            Search Bar
        </h1>
            <label>
                Search for: <input  type="text" value={search} onChange={handleChangeSearch}/>
            </label>
            <br/>
            <label>
                Media Type: 
                <select type="Media"  value={media} onChange={handleChangeMedia}>
                    <option value="all">All</option>   
                    <option value="movie">Movie</option>
                    <option value="podcast">podcast</option>
                    <option value="music">Music</option>
                    <option value="audiobook">Audiobook</option>
                    <option value="shortFilm">Short Film</option>
                    <option value="tvShow">TV Show</option>
                    <option value="software">Software</option>
                    <option value="ebook">Ebook</option>     

                </select>
            </label>
            <br/>
            <button onClick={handleSubmit}>
                submit
            </button>


        
          <ol>
            {currentSearchResults.map(item =>
              <li className="searches" key ={item.name + item.collectionName}>Item Name: {item.name}<br/>from: {item.collectionName}<br/>By: {item.artistName}<br/>Released on: {item.releaseDate}<br/><img src={item.image} alt="Pic of relevent movie"/><br/> <button onClick={() => saveToFavorites(item)}>Add above to favorites</button><br/><br/><br/></li>
            )}
          </ol>


        <h1>Favorites List</h1>
        <ul>
            {currentFavorites.map(item =>
              <li key ={item.name + item.collectionName}>Item Name: {item.name}<br/>from: {item.collectionName}<br/>By: {item.artistName}<br/>Released on: {item.releaseDate}<br/><img src={item.image} alt="Pic of relevent movie"/><br/><button onClick={() => deleteFromFavorites(item)}>Remove above to favorites</button><br/><br/><br/></li>
            )}
        </ul>
        </>
    );
}

export default Searchbar;