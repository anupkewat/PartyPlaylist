import React from "react"
import { useState, useEffect } from "react"
import useAuth from "./useAuth"

import PlaylistView from "./PlaylistView"
import SignUpForm from "./SignUpForm"
// import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import SearchInput from "./SearchInput"
import axios from "axios"
// import Button from './Button'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const spotifyApi = new SpotifyWebApi({
  clientId: "8b945ef10ea24755b83ac50cede405a0",
})




export default function Dashboard({ code }) {
  const accessToken = useAuth(code)
  // console.log(accessToken)
  const [createdPlaylist, setCreatedPlaylist] = useState(false)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")
  const [playlistName ,setPlaylistName] = useState("")
  const [playlistId , setPlaylistId] = useState("")


  

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }



  // useEffect(() => {
  //   if (!playingTrack) return

  //   axios
  //     .get("http://localhost:3001/lyrics", {
  //       params: {
  //         track: playingTrack.title,
  //         artist: playingTrack.artist,
  //       },
  //     })
  //     .then(res => {
  //       setLyrics(res.data.lyrics)
  //     })
  // }, [playingTrack])

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
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>

      {createdPlaylist ? 
<div>
        <div>
          
          <p style={title_style} >Your Party </p>
        <SearchInput 
          placeholder="Search Songs/Artists"
          value={search}
          onChange={(value) => setSearch(value)}
        />

        <div className="flex-grow-1 my-2" styl  e={{ overflowY: "auto" }} >
        <ToastContainer />
          {searchResults.slice(0, 8).map(track => (
  
            <TrackSearchResult
            setSearch = {setSearch}
              track={track}
              key={track.uri}
              key1 = {track.uri}
              chooseTrack={chooseTrack}
              playlistId = {playlistId}
              accessToken = {accessToken}
  
            />
          ))}
          {/* {searchResults.length === 0 && (
            <div className="text-center" style={{ whiteSpace: "pre" }}>
              {lyrics}
            </div>
          )} */}
        </div> 
        <div>
          <PlaylistView accessToken={accessToken} playlistId={playlistId}/>
        </div>
  
        </div>
</div>
      :
      <div>
  <SignUpForm accessToken = {accessToken} setCreatedPlaylist = {setCreatedPlaylist} setPlaylistId = {setPlaylistId} setPlaylistName = {setPlaylistName}/>
      
     </div>

    }
    </Container>
  )


}


const title_style = {
  textAlign : 'center',
  color: '#e8e8e8',
  fontWeight: 900,
  fontSize: '4rem',
  fontFamily: 'Montserrat,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"!important',
};