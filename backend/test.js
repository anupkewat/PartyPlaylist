const createPlaylistRequest = async () => {
  const url = "http://localhost:3001/createplaylist";

  const requestBody = {
    ownerName: "John Doe",
    partyName: "Party123",
    playlistName: "MyPlaylist",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Call the function to make the request
createPlaylistRequest();
