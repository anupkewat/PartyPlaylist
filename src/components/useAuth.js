import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState();
  const [refreshToken, setRefreshToken] = useState();
  const [expiresIn, setExpiresIn] = useState();

  useEffect(() => {
    console.loh('himeat')
    const fetchData = async () => {
      try {
        const res = await axios.post("http://localhost:3001/login", {
          code,
        });

        // Update state variables
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);
      } catch (err) {
        // Handle error
        console.log(err);
      }
    };

    fetchData(); // Call the async function
  }, [code]);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const interval = setInterval(() => {
      // if (localStorage.getItem("PartyNameLS")){
      //   const PartyNameValue = localStorage.getItem("PartyNameLS")
      //   console.log(PartyNameValue)

      // }

      let oldAccessToken = accessToken;


      console.log('running refresh');
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken,
        })
        .then(res => {
          // Update state variables
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);          
          console.log('successfully refreshed');

          
        })
        .catch((err) => {
          // window.location = "/"
          console.log('refresh err :', err)
        }

        )
        axios.post("http://localhost:3001/update_accesstoken" , {oldAccessToken})
        .then ( res => {})
        .catch ( (err) => {})
    }, (expiresIn - 60) * 1000)
    console.log('succesfully refreshed')
    return () => clearInterval(interval)
  }, [refreshToken, expiresIn])
  return accessToken
}
