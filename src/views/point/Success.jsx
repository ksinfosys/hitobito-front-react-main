import React from "react";
import {useEffect} from "react";
import axios from "axios";
import {getCookie} from "../../utils/cookie";
import {useRecoilState} from "recoil";

const Success = () => {

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionId');
    axios
      .post(
        `/api/stripe/checkout/success/${sessionId}`,
        {},
        {
          withCredentials: true,
          headers: {
            accessToken: getCookie("accessToken"),
            lastLoginTime: getCookie("lastLoginTime"),
          },
        }
      )
      .then(() => {
        localStorage.removeItem("sessionId");
        window.close();
      });
  }, [])

  return<>
  </>
}

export default Success
