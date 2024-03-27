import React, { useEffect, useState } from "react";
import PlayingSong from "./PlayingSong";
const SpotifyPlayer = ({ accessToken }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.spotify.com/v1/me/player/currently-playing",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const data = await response.json();
        setCurrentTrack(data.item);
        setIsPlaying(!data.is_playing);
      } catch (error) {
        console.error("Error fetching player data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [accessToken]);

  const togglePlayback = async () => {
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling playback:", error);
    }
  };

  const skipToNext = async () => {
    try {
      await fetch("https://api.spotify.com/v1/me/player/next", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error skipping to next track:", error);
    }
  };

  const skipToPrevious = async () => {
    try {
      await fetch("https://api.spotify.com/v1/me/player/previous", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("Error skipping to previous track:", error);
    }
  };

  return (
    <div>

      {currentTrack && (
        <div>
          <PlayingSong
            isPlaying={isPlaying}
            accessToken={accessToken}
            togglePlayback={togglePlayback}
            skipToNext={skipToNext}
            skipToPrevious={skipToPrevious}
            songName={currentTrack.name}
            artistName={currentTrack.artists
              .map((artist) => artist.name)
              .join(", ")}
            imageUrls={currentTrack.album.images[0].url}
          />
          
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;
