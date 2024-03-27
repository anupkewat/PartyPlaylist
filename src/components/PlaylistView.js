import React from "react"
import { useState, useEffect } from "react"
import axios from 'axios';
import SongCard from './SongCard'
import TrackCard from "./TrackCard";
require('dotenv').config()
  const PlaylistView = ({ accessToken, playlistId }) => {
    const HOST = process.env.REACT_APP_HOST_SERVER
    console.log(HOST)
    const [playlistData, setPlaylistData] = useState();



    

      const extractTrackInfo = (apiResponse) => {
      const tracks = apiResponse.data.tracks.items;
  
      const trackInfoArray = tracks.map((track) => {
      const trackData = track.track;
      const artists = trackData.artists.map((artist) => artist.name).join(', '); // Join artists with a comma
      const images = trackData.album.images.map((image) => image.url);
  
        return {
          id: trackData.id,
          name: trackData.name,
          artists: artists,
          imageUrls: images,
        };
      });
  
      return trackInfoArray;
    };


    useEffect(() => {
      const fetchData = async () => {
        try {
          const requestData = {
            playlistId: playlistId,
            accessToken: accessToken
          };
  
          const url = `${HOST}/reorderplaylist`;
          
  
          const response = await axios.post(url, requestData);
          console.log('reordered playlist:', response.data);
        } catch (error) {
          console.error('Error:', error.response.data);
        }
      };
  
      const interval = setInterval(() => {
        fetchData();
      }, 60 * 1000); // Trigger every 60 seconds
  
      return () => clearInterval(interval); 
  
    }, []); 
  

    useEffect(() => {
      const fetchData = async () => {
        console.log('getting playlist items...');

        try {
          const response = await axios.get(`${HOST}/getplaylistitems`, {
            params: {
              accessToken,
              playlistId,
            },
          });

         const trackList = extractTrackInfo(response);
          setPlaylistData(trackList)

        } catch (error) {
          console.error('Error fetching playlist items:', error);
        }
      };

      fetchData();

      const intervalId = setInterval(() => {
        fetchData();
      }, 10000);

      return () => clearInterval(intervalId);
    }, [accessToken, playlistId]);
      

    return (
      <div className="playlist-container" >
        {playlistData ?
          (
            playlistData.map((track) => (
              <TrackCard
                playlistId = {playlistId}
                key={track.id}
                id = {track.id}
                songName={track.name}
                artistName={track.artists}
                imageUrls={track.imageUrls}
              />
            ))
          )
          : (
            <p>Loading...</p>
          )}
      </div>
    );
  };

  export default PlaylistView;
