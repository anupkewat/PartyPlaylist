import React from "react"
import { Container } from "react-bootstrap"
const HOST = process.env.REACT_APP_HOST

const AUTH_URL =
  `https://accounts.spotify.com/authorize?client_id=5d8efe2116894bf88a5c6d20970b56ca&response_type=code&redirect_uri=${HOST}/login&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-private%20playlist-modify-public`

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  )
}
