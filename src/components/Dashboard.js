import React from "react"
import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import Box from '@mui/material/Box';
import RejoinForm from "./RejoinForm";
import PlaylistView from "./PlaylistView"
import SignUpForm from "./SignUpForm"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Settings from "./Settings"
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
  const [value, setValue] = React.useState(0);
  const accessToken = useAuth(code)
  // console.log(accessToken)
  const [createdPlaylist, setCreatedPlaylist] = useState(false)
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [playingTrack, setPlayingTrack] = useState()
  const [lyrics, setLyrics] = useState("")
  const [playlistName ,setPlaylistName] = useState("")
  const [playlistId , setPlaylistId] = useState("")
  const [toggleSettings, setToggleSettings] = useState()


  

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


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      {createdPlaylist ? 
          
          
          
          (
          
            

          
            
          <div style ={{alignContent : 'center' , justifyContent : 'center'}}>
          <div style ={{alignContent : 'center'}}>
           <div style = {{ flexDirection: 'row'}}>
            <p style={title_style}>Your Party </p>
            </div> 



            <Box sx={{ width: '100%' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Playlist" sx={{ color: '#e8e8e8' }} />
          <Tab label="Manage Party" sx={{ color: '#e8e8e8' }} />
        </Tabs>
      </Box>
      { value === 0 &&
            <div>
            <SearchInput
              placeholder="Search Songs/Artists"
              value={search}
              onChange={(value) => setSearch(value)}
            />
            
            <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
              <ToastContainer />
              {searchResults.slice(0, 8).map((track) => (
                <TrackSearchResult
                  setSearch={setSearch}
                  track={track}
                  key={track.uri}
                  key1={track.uri}
                  chooseTrack={chooseTrack}
                  playlistId={playlistId}
                  accessToken={accessToken}
                />
              ))}
              
            </div>

              <PlaylistView
                accessToken={accessToken}
                playlistId={playlistId}
              />

            </div>
}

{
  value === 1 &&  <div> <Settings/> </div>
}

          </div>
        </div>




      ) 
      
      
      
      
      
      : (
        <div>
          <div>
            <p style={title_style}>Start Your Party </p>
              <Tabs value={value} onChange={handleChange} centered>
                <Tab label="New Party" sx={{ color: "#e8e8e8" }} />
                <Tab label="Rejoin Party" sx={{ color: "#e8e8e8" }} />
              </Tabs>

            {value === 0 && (
              <SignUpForm
              accessToken={accessToken}
              setCreatedPlaylist={setCreatedPlaylist}
              setPlaylistId={setPlaylistId}
              setPlaylistName={setPlaylistName}
            />
            )}
            {value === 1 && (
              <RejoinForm
              accessToken = {accessToken}
              setCreatedPlaylist={setCreatedPlaylist}
              setPlaylistId={setPlaylistId}
              setPlaylistName={setPlaylistName} />
                
              
            )}
          </div>
        </div>
      )}
    </Container>
  );
}

const title_style = {
  textAlign: "center",
  color: "#e8e8e8",
  fontWeight: 900,
  fontSize: "4rem",
  fontFamily:
    'Montserrat,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji"!important',
};