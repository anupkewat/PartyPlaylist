import React , { createContext,useState,useEffect } from "react";

const JoinPartyContext = createContext({}); 

export const DataProvider =  ({ children }) => {
const [accessToken, setAccessToken] = useState()
const [search, setSearch] = useState("")
const [searchResults, setSearchResults] = useState([])
const [playingTrack, setPlayingTrack] = useState()
const [playlistName ,setPlaylistName] = useState("")
const [playlistId , setPlaylistId] = useState("")
const [partyDetails , setPartyDetails] = useState()
const [ownerName , setOwnerName] = useState()



    return (
        <JoinPartyContext.Provider value= {{
            partyDetails, setPartyDetails,
            accessToken, setAccessToken,
            playlistName ,setPlaylistName,
            ownerName , setOwnerName, 
            playlistId, setPlaylistId
        }}>

        {children}

        </JoinPartyContext.Provider>
    )
}

export default JoinPartyContext;
