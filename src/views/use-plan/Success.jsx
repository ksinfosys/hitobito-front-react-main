import React from "react";
import {useEffect} from "react";
import axios from "axios";
import {getCookie} from "../../utils/cookie";
import {useRecoilState} from "recoil";

const Success = () => {
  const [businessPlan, setBusinessPlan] = useRecoilState(businessPlan);

  useEffect(() => {
    axios
      .post(
        `/api/stripe/sub/success/${sessionId}`,
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
        setBusinessPlan({
          isOpen: 2,
          sessionId: ''
        })
        window.close();
      });
  }, [])

  return<>
  </>
}

export default Success
