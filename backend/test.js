const createPlaylistRequest = async () => {
  const url = "http://localhost:3001/createplaylist";

  const requestBody = {
    ownerName: "John Doe",
    partyName: "Party123",
    playlistName: "MyPlaylist",
    accessToken: "BQDrb6HoTnezGKcPx2EPFb7gwUFDNj94g_-np_zFEBoPeJNI1ls0QMfDxdNounk0Z-I0GzpqzSapXbtpaVw-Aty-HDZE2wDxJAlLFsM8zqz_M2cV3DdRVSTTDMQGK5_bDtiC8QEcET4NlXZZbuVTFt3TioCuoi_e8PM9UkpIEZcTw6CnX3muFKGwTCiO2kiRIb84Fz4sSFI8FUtgUCzj68W0zfS5G7Ng7LDIXzKXRGivZByUrov9Jgk0HS0irHrmACkKimAHNb4gGhvzmGXeBlikLZ_vLAc6X9i3wmrtcp4LZ6g",
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
