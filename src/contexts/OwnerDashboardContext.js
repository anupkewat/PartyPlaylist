import React, { createContext, useState, useContext, useEffect } from "react";

const DashboardContext = createContext();

// Create a DashboardProvider component to wrap your Dashboard component
export const DashboardProvider = ({ children }) => {
  const [createdPlaylist, setCreatedPlaylist] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [playlistId, setPlaylistId] = useState("");

  // Provide the context value to the wrapped component tree
  return (
    <DashboardContext.Provider
      value={{
        createdPlaylist,
        setCreatedPlaylist,
        search,
        setSearch,
        searchResults,
        setSearchResults,
        playingTrack,
        setPlayingTrack,
        lyrics,
        setLyrics,
        playlistName,
        setPlaylistName,
        playlistId,
        setPlaylistId,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// Custom hook to consume the context
export const useDashboardContext = () => useContext(DashboardContext);
