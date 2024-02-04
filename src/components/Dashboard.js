import React from "react"
import { useState, useEffect } from "react"
import useAuth from "./useAuth"
import PlaylistView from "./PlaylistView"
import SignUpForm from "./SignUpForm"
// import Player from "./Player"
import TrackSearchResult from "./TrackSearchResult"
import { Container, Form } from "react-bootstrap"
import SpotifyWebApi from "spotify-web-api-node"
import axios from "axios"
// import Button from './Button'

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
      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }} >
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div> 
      <div>
        <PlaylistView accessToken={accessToken} playlistId={playlistId}/>
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
