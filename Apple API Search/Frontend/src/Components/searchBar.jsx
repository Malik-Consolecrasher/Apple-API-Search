import { useState } from "react";
import axios from 'axios';

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
    const [currentSearchResults, setCurrentSearchResults] = useState("")
    const [currentSearchResultsCollection, setCurrentSearchResultsCollection] = useState("")
    const [currentFavorites, setCurrentFavorites] = useState([])

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
          console.log(data);
          setCurrentSearchResults(data.results[0].trackCensoredName)
          setCurrentSearchResultsCollection(data.results[0].collectionCensoredName)
        })
        .catch((error) => {
            console.error("Could not search", error)
        });
    };
    function saveToFavorites(){
      setCurrentFavorites(currentArray => [...currentArray, " " + currentSearchResults])
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
                    <option value="movie">Movie</option>
                    <option value="podcast">podcast</option>
                    <option value="music">Music</option>
                    <option value="audiobook">Audiobook</option>
                    <option value="shortFilm">Short Film</option>
                    <option value="tvShow">TV Show</option>
                    <option value="software">Software</option>
                    <option value="ebook">Ebook</option>     
                    <option value="all">All</option>   
                </select>
            </label>
            <br/>
            <button onClick={handleSubmit}>
                submit
            </button>


        
          <p>The name of your search result is: {currentSearchResults}</p>
          <p>Which is from: {currentSearchResultsCollection}</p>
        

        <button onClick={saveToFavorites}>Save to favorites</button>
        <h1>Favorites List</h1>
        {currentFavorites}
        </>
    );
}

export default Searchbar;