import { useState } from "react";
import axios from 'axios';
import './styles.css'


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
    function saveToFavorites(e){
      setCurrentFavorites(currentArray => [...currentArray, "," + e])
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
              <li key ={item.name} onClick={() => saveToFavorites(item.name)}>Item Name: {item.name}<br/>from: {item.collectionName}<br/>By: {item.artistName}<br/>Released on: {item.releaseDate}<br/><img src={item.image} alt="Pic of relevent movie"/><br/><br/><br/></li>
            )}
          </ol>


        <button onClick={saveToFavorites}>Save All Results to favorites</button>
        <h1>Favorites List</h1>
        {currentFavorites}
        </>
    );
}

export default Searchbar;