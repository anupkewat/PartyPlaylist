import React, { useState ,useEffect } from 'react';
import { useContext } from 'react';
import JoinPartyContext from '../contexts/JoinPartyContext';
import TrackSearchResult from "./TrackSearchResult"
import SpotifyWebApi from "spotify-web-api-node"
import SearchInput from "./SearchInput"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const spotifyApi = new SpotifyWebApi({
    clientId: "8b945ef10ea24755b83ac50cede405a0",
  })
const AddSongDashboard = ({accessToken , playlistId}) => {
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    
  

   

useEffect(() => {
    
    
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
      }, [accessToken])
    
useEffect(() => {
    
        if (!search) return setSearchResults([])
        if (!accessToken) return
    
        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            
          if (cancel) return
          setSearchResults(
            res.body.tracks.items.map(track => {
              const smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image
                  return smallest
                },
                track.album.images[0]
              )
                

              return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url,
              }
            })
          )
        })
    
        return () => (cancel = true)
      }, [search, accessToken])




    
      
  return (

    <div> 
        <SearchInput 
        placeholder="Search Songs/Artists"
        value={search}
        onChange={(value) => setSearch(value)}
      />
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }} >
      <ToastContainer />
        {searchResults.slice(0, 8).map(track => (

          <TrackSearchResult setSearch = {setSearch} track={track} key={track.uri} key1 = {track.uri}  playlistId = {playlistId} accessToken = {accessToken} />
        ))}

      </div> 
      <div>

      </div>


</div>
  )
}

export default AddSongDashboard ;