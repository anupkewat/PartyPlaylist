import React from "react"
import { useState, useEffect } from "react"
import axios from 'axios';
import SongCard from './SongCard'

  const PlaylistView = ({ accessToken, playlistId }) => {
    const [playlistData, setPlaylistData] = useState();


    
    
    function extractTrackInfo(apiResponse) {
      const tracks = apiResponse.data.tracks.items;
    
      const trackInfoArray = tracks.map(track => {
        const trackData = track.track;
        const artists = trackData.artists.map(artist => artist.name);
        const images = trackData.album.images.map(image => image.url);
    
        return {
          id: trackData.id,
          name: trackData.name,
          artists: artists,
          imageUrls: images
        };
      });
    
      return trackInfoArray;
    }
    
                                                                                     

    useEffect(() => {
      const fetchData = async () => {
        console.log('getting playlist items...');

        try {
          const response = await axios.get('http://localhost:3001/getplaylistitems', {
            params: {
              accessToken,
              playlistId,
            },
          });

          // console.log(response)

          const parsedInfo = extractTrackInfo(response)
          setPlaylistData(parsedInfo)

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
      <div className="playlist-container">
        {playlistData ?
          (
            playlistData.map(track => (
              <div key={track.id} className="track-item">
                <SongCard trackName={track.name} artistNames={track.artists.join(', ')} image={track.imageUrls[0]} />
              </div>
            ))
          )
          : (
            <p>Loading...</p>
          )}
      </div>
    );
  };

  export default PlaylistView;
